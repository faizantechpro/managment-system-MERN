import express from 'express';
import Joi from 'joi';
import argon2 from 'argon2';

import asyncHandler from '../utils/async-handler';
import { userServiceFactory, TenantService } from '../services';
import { emitAsyncSafe } from '../middlewares/emitter';
import { permissionsValidator } from 'lib/middlewares/permissions';
import { userCredentialFactory } from 'lib/services/user';
import {
  Forbidden,
  InvalidCredentials,
  InvalidPayload,
  ResourceNotFound,
} from 'lib/middlewares/exception';

const router = express.Router();

// TODO FE to split GET /users and GET /contacts
router.get(
  '/users/guests',
  asyncHandler(async (req, res) => {
    const { search } = req.query;

    const service = userServiceFactory(req.user);
    const guests = await service.getMatchGuests(String(search));

    res.json(guests);
  })
);

// TODO FE to split GET /users/ids and GET /contacts/ids
router.get(
  '/users/guests/ids',
  asyncHandler(async (req, res) => {
    const ids = req.query.ids || '';

    // front end is providing string of: ',{id}' which results in ['',id]
    const idsParse = (<string>ids).split(',').filter((item) => !!item);

    const service = userServiceFactory(req.user);
    const guests = await service.getGuestByIds(idsParse);

    res.json(guests);
  })
);

router.delete(
  '/users',
  permissionsValidator(),
  asyncHandler(async (req, res) => {
    const { ids } = req.query as { ids: string };
    const service = userServiceFactory(req.user);
    const resp = await service.deleteAll(ids.split(','));

    res.json(resp);
  })
);

router.get(
  '/users/me',
  asyncHandler(async (req, res, next) => {
    if (!req.user?.id) {
      throw new InvalidCredentials();
    }
    const service = userServiceFactory(req.user);

    try {
      const item = await service.getUser(req.user.id);
      return res.json(item);
    } catch (error) {
      if (error instanceof Forbidden) {
        res.locals.payload = { data: { id: req.user.id } };
        res.status(401).send('Unauthorized');
      }

      throw error;
    }
  })
);

router.put(
  '/users/me',
  asyncHandler(async (req, res) => {
    const {
      currency,
      datetimeFormat,
      email,
      firstName,
      language,
      lastName,
      timezone,
      avatar,
      title,
      phone,
    } = req.body;
    const userService = userServiceFactory(req.user);
    const respUpdate = await userService.updateUserInfo({
      currency,
      datetimeFormat,
      email,
      firstName,
      language,
      lastName,
      timezone,
      avatar,
      title,
      phone,
    });

    return res.json(respUpdate);
  })
);

router.patch(
  '/users/:id/status',
  permissionsValidator(),
  asyncHandler(async (req, res) => {
    const {
      params: { id },
      body: { status },
    } = req;
    const { error } = Joi.string().not('').required().validate(status);

    if (error) throw new InvalidPayload(error.message);

    const usersServices = userServiceFactory(req.user);
    const userUpdate = await usersServices.changeStatusById(id, status);

    return res.json(userUpdate);
  })
);

router.post(
  '/users/:id/impersonate',
  permissionsValidator(),
  asyncHandler(async (req, res) => {
    const {
      params: { id },
    } = req;

    const usersServices = userServiceFactory(req.user);
    const tkPayload = await usersServices.impersonate(id);

    return res.json(tkPayload);
  })
);

router.put(
  '/users/change_password',
  asyncHandler(async (req, res) => {
    const {
      body: { currentPassword, newPassword },
      user,
    } = req;

    const emitStatus = (status: 'fail' | 'success') => {
      emitAsyncSafe(
        'auth.login',
        { currentPassword, newPassword },
        {
          event: 'auth.login',
          action: 'login',
          schema: 'users',
          payload: { currentPassword, newPassword },
          status,
          user: user.id,
        }
      );
    };

    const service = userCredentialFactory(user);
    const userCredential = await service.getOne();
    if (!userCredential) {
      throw new ResourceNotFound('User');
    }

    if (currentPassword && newPassword) {
      if (!userCredential.password) {
        emitStatus('fail');
        throw new InvalidCredentials();
      }

      const verified = await argon2.verify(
        userCredential.password,
        currentPassword
      );
      if (!verified) {
        emitStatus('fail');
        throw new InvalidCredentials();
      }

      const isSamePassword = await argon2.verify(
        userCredential.password,
        newPassword
      );
      if (isSamePassword) {
        emitStatus('fail');
        throw new InvalidCredentials();
      }
    }

    await service.upsert({
      password: newPassword,
    });

    return res.json({});
  })
);

router.post(
  '/users/invite',
  permissionsValidator(),
  asyncHandler(async (req, res) => {
    const service = userServiceFactory(req.user);
    const { emails, role, tenant } = req.body;
    let inviteUrl: any = null;
    if (tenant) {
      const tenantInfo = await TenantService.getTenantById(tenant);
      const subdomain = tenantInfo.domain;
      if (subdomain) {
        inviteUrl = `https://${subdomain}/sign-up`;
      }
    }

    const inviteUser = async (email: string) => {
      try {
        await service.inviteUser(tenant, email, role, inviteUrl);
        return { isValid: true, email };
      } catch (error: any) {
        return {
          isValid: false,
          email,
          error: { ...error, message: error.message },
        };
      }
    };

    const invitationResults = await Promise.all(
      emails.map(async (email: any) => {
        return inviteUser(email);
      })
    );

    return res.json(invitationResults);
  })
);

const resentInviteSchema = Joi.object({
  id: Joi.string().uuid({ version: 'uuidv4' }).required(),
  email: Joi.string().email(),
  invite_url: Joi.string().uri(),
});

router.post(
  '/users/resent-invite',
  permissionsValidator(),
  asyncHandler(async (req, res) => {
    const { error } = resentInviteSchema.validate(req.body);
    if (error) throw new InvalidPayload(error.message);

    const service = userServiceFactory(req.user);
    await service.resendInvite(
      req.body.id,
      req.body.email,
      req.body.invite_url || null
    );

    return res.json();
  })
);

const messageSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  message: Joi.string().required(),
});

router.post(
  '/users/message',
  asyncHandler(async (req, res) => {
    const { error } = messageSchema.validate(req.body);

    if (error) throw new InvalidPayload(error.message);

    const { name, email, message } = req.body || {};

    const service = userServiceFactory(req.user);

    await service.message(name, email, message);

    return res.json();
  })
);

// Delete user from group
router.delete(
  `/users/:userId/group`,
  permissionsValidator(),
  asyncHandler(async (req, res) => {
    const { users } = req.body;
    const { id } = req.params;
    const userService = userServiceFactory(req.user);
    const updateUser = await userService.updateUserById({
      ...users,
      id,
      group_id: null,
    });
    res.json(updateUser);
  })
);

router.get(
  '/users/:id',
  asyncHandler(async (req, res) => {
    const service = userServiceFactory(req.user);
    try {
      const id: any = req.params.id;
      const item = await service.getUser(id);

      return res.json(item);
    } catch (error) {
      if (error instanceof Forbidden) {
        res.locals.payload = { data: { id: req.user.id } };
        res.status(401).send('Unauthorized');
      }

      throw error;
    }
  })
);

const userSchema = Joi.object({
  firstName: Joi.string().allow(null).required(),
  lastName: Joi.string().allow(null).required(),
  avatar: Joi.string().allow(null).required(),
  status: Joi.string().required(),
  role: Joi.string().uuid({ version: 'uuidv4' }).required(),
  title: Joi.string().allow(null, '').optional(),
  phone: Joi.string().allow(null, '').optional(),
});

const userInviteSchema = Joi.object({
  firstName: Joi.string().allow(null, ''),
  lastName: Joi.string().allow(null, ''),
  avatar: Joi.string().allow(null).required(),
  status: Joi.string().required(),
  role: Joi.string().uuid({ version: 'uuidv4' }).required(),
  title: Joi.string().allow(null, '').optional(),
  phone: Joi.string().allow(null, '').optional(),
});

router.put(
  '/users/:id',
  permissionsValidator(),
  asyncHandler(async (req, res) => {
    const {
      firstName,
      lastName,
      status,
      avatar,
      role,
      roleService,
      title,
      phone,
    } = req.body;

    if (roleService) {
      const { id } = req.params;
      const usersServices = userServiceFactory(req.user);

      const userUpdate = await usersServices.updateUserRole({
        id,
        role,
      });
      return res.json(userUpdate);
    }

    let valid = null;
    if (status !== 'invited') {
      valid = userSchema.validate(req.body);
    } else {
      valid = userInviteSchema.validate(req.body);
    }

    const { error } = valid;

    if (error) throw new InvalidPayload(error.message);

    const { id } = req.params;
    const usersServices = userServiceFactory(req.user);

    const userUpdate = await usersServices.updateUserById({
      id,
      firstName,
      lastName,
      status,
      avatar,
      role,
      title,
      phone,
    });

    return res.json(userUpdate);
  })
);

export default router;
