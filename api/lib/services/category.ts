import { Category } from '../database';
import { CategoryModel } from '../database/models/category';
import { UserContext } from '../middlewares/openapi';
import { AuthUser } from 'lib/middlewares/auth';
import ContextQuery from './utils/ContextQuery';

abstract class CategoryService extends ContextQuery<CategoryModel> {
  async swapPosition(id: number, position: number, user: UserContext) {
    const category = await Category.findByPk(id);
    const positionCategory = await Category.findOne({
      where: { position, tenant_id: user.tenant },
    });

    const previousPosition = category?.position;

    await category?.update({ position });
    await positionCategory?.update({ position: previousPosition });

    return {};
  }
}

export class AdminCategoryService extends CategoryService {
  getContextQuery() {
    return {};
  }
}
export class OwnerCategoryService extends CategoryService {
  getContextQuery() {
    return {
      tenant_id: this.user.tenant,
    };
  }
}

export class UserCategoryService extends CategoryService {
  getContextQuery() {
    return {
      tenant_id: this.user.tenant,
    };
  }
}

export function CategoryServiceFactory(user: AuthUser) {
  if (user?.auth?.isAdmin) {
    return new AdminCategoryService(Category, user);
  } else if (user?.auth?.isOwner) {
    return new OwnerCategoryService(Category, user);
  }
  return new UserCategoryService(Category, user);
}
