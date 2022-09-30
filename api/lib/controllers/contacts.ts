import express from 'express';

import { contactServiceFactory } from '../services/contacts';
import asyncHandler from '../utils/async-handler';
import { permissions } from 'lib/utils/permissions';
import { permissionsValidator } from 'lib/middlewares/permissions';
import { ContactOwnerService } from 'lib/services';
import { contactPrincipalOwnerValidator } from 'lib/middlewares/ownerValidator';
import { ContextMiddleware } from 'lib/middlewares/context';

const router = express.Router();

const path = '/contacts';

const contactsPermissions = permissions.contacts;

router.get(
  `${path}/check-relations`,
  asyncHandler(async (req, res) => {
    const { ids } = req.query as { ids: string };

    const service = contactServiceFactory(req.user);
    const relations = await service.getRelations(ids.split(','));

    return res.json({ relations });
  })
);

router.get(
  `${path}/:id`,
  permissionsValidator(contactsPermissions.view),
  asyncHandler(async (req, res, next) => {
    // TODO migrate this to openapi and it won't be an issue.... i hate this :(
    if (req.params.id === 'fields' || req.params.id === 'owners') {
      return next();
    }
    const { id } = req.params;

    const service = contactServiceFactory(req.user);
    const contacts = await service.getContactById(id);
    res.json(contacts);
  })
);

router.get(
  path,
  permissionsValidator(contactsPermissions.view),
  asyncHandler(async (req, res) => {
    // can't type to boolean....
    if (req.query.recent_activity === 'true') {
      const contacts = await (
        req as unknown as ContextMiddleware
      ).services.biz.contactFeed.getAsRecentlyViewed(
        undefined,
        req.query as any,
        {}
      );

      return res.json({
        pagination: contacts.pagination,
        contacts: contacts.data,
      });
    }

    const service = contactServiceFactory(req.user);
    const infoContacts = await service.getContacts(req.query);

    const { contacts, pagination } = infoContacts;

    const contactOwnerService = new ContactOwnerService(req.user);
    const listContacts = await Promise.all(
      contacts?.map(async (contact: any) => {
        const owners = await contactOwnerService.getOwners(contact.id, {
          limit: 20,
          page: 1,
        });
        return { ...contact.dataValues, owners: owners?.data || [] };
      })
    );

    return res.json({
      pagination,
      contacts: listContacts,
    });
  })
);

router.put(
  `${path}/:id`,
  permissionsValidator(contactsPermissions.edit),
  asyncHandler(async (req, res, next) => {
    // TODO migrate this to openapi and it won't be an issue.... i hate this :(
    if (req.params.id === 'fields') {
      return next();
    }
    const { id } = req.params;
    const body = { ...req.body, date_modified: new Date() };

    const service = contactServiceFactory(req.user);
    await service.updateContact(id, body);
    res.json({});
  })
);

router.put(
  `${path}/:contactId/organization/:organizationId/link`,
  permissionsValidator(contactsPermissions.edit),
  asyncHandler(async (req, res) => {
    const { contactId, organizationId } = req.params;
    const service = contactServiceFactory(req.user);
    await service.linkOrganization(contactId, organizationId);
    res.json({});
  })
);

router.put(
  `${path}/:contactId/organization/:organizationId/unlink`,
  permissionsValidator(contactsPermissions.edit),
  asyncHandler(async (req, res) => {
    const { contactId, organizationId } = req.params;

    const service = contactServiceFactory(req.user);
    await service.unlinkOrganization(contactId, organizationId);
    res.json({});
  })
);

router.delete(
  path,
  permissionsValidator(contactsPermissions.delete),
  asyncHandler(async (req, res) => {
    const { ids } = req.query as { ids: string };
    const service = contactServiceFactory(req.user);
    const contactsToDelete = ids.split(',');

    const deleteContact = async (id: string) => {
      try {
        await service.deleteOne(id);
        return { id: id, result: 'success', msg: '' };
      } catch (error: any) {
        return {
          id: id,
          result: 'failed',
          msg: error.message,
        };
      }
    };

    const contactsDeletionResult = await Promise.all(
      contactsToDelete.map(async (id: any) => {
        return deleteContact(id);
      })
    );

    return res.json(contactsDeletionResult);
  })
);

router.delete(
  `${path}/:id`,
  permissionsValidator(contactsPermissions.delete),
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!req.user.admin) {
      await contactPrincipalOwnerValidator({ id, user: req.user });
    }

    const service = contactServiceFactory(req.user);
    await service.deleteOne(id);
    res.json({});
  })
);

router.post(
  path,
  permissionsValidator(contactsPermissions.create),
  asyncHandler(async (req, res) => {
    const service = contactServiceFactory(req.user);

    const { phone, phone_location, assigned_user_id, external_id } = req.body;

    if (external_id) {
      const external = await service.getContactByExternalId(
        external_id as string
      );

      if (external) {
        return res
          .status(404)
          .json({ error: 'Contact was imported already', code: 404 });
      }
    }

    const data = {
      ...req.body,
      [`phone_${phone_location}`]: phone,
      date_entered: new Date(),
      date_modified: new Date(),
      created_by: req.user.id,
      external_id: external_id || null,
      modified_user_id: req.user.id,
      assigned_user_id: assigned_user_id || req.user.id,
      tenant_id: req.user.tenant,
    };

    const emails = Object.keys(req.body).filter((key) =>
      key.includes('email_location')
    );
    const phones = Object.keys(req.body).filter((key) =>
      key.includes('phone_location')
    );

    emails?.forEach((location) => {
      const emailName = location.replace('_location', '');

      data[`email_${req.body[location]}`] = req.body[emailName];
    });

    phones?.forEach((location) => {
      const phoneName = location.replace('_location', '');

      data[`phone_${req.body[location]}`] = req.body[phoneName];
    });

    const response = await service.createContact(data);

    res.json(response);
  })
);

export default router;
