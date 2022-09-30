import { v4 as uuidv4 } from 'uuid';
import { FeedModel, FeedModifyAttributes } from 'lib/database/models/feed';
import Base from '../utils/Base';
import { AuthUser } from 'lib/middlewares/auth';
import { Feed } from 'lib/database';

export type Diff = {
  key: string;
  previousValue: string;
  currentValue: string;
};

/**
 * This service is intended to be used to add logs onto our Feed. Due to
 * possible circular dependency issue, there should be **NO** getters here.
 * Please use `FeedService` for retrieving from the feed.
 *
 * Use this service as a way for other services to add onto the feed log only.
 */
class FeedLogService extends Base<FeedModel> {
  async create(data: FeedModifyAttributes) {
    // TODO determine whether user context can be used instead
    return this.defaultCreate({
      ...data,
      id: uuidv4(),
    });
  }

  /**
   * Creates a log entry only if an actual update ocurred by comparing the
   * previous object against the newly updated object.
   */
  async createOnDiff(
    // this is the base log object to use on diff
    data: Omit<
      FeedModifyAttributes,
      'object_data' | 'tenant_id' | 'created_by'
    >,
    prevModel: any,
    update: any,
    options: {
      exclude?: string[];
      include?: string[];
      parseAddress?: boolean;
      generateSummary?: (diff: Diff[]) => string | undefined;
    } = {}
  ) {
    const diff = this.getUpdateDiff(prevModel, update, options);

    // no audit diff found, no need to add to log this update event
    // note: this does NOT mean update should be skipped
    if (diff.length === 0) {
      return;
    }

    const createPayload: FeedModifyAttributes = {
      ...data,
      tenant_id: this.user.tenant,
      created_by: this.user.id,
      object_data: { updates: diff },
    };

    // i hate this too..
    if (options.generateSummary) {
      createPayload.summary = options.generateSummary(diff) || data.summary;
    }

    return this.create(createPayload);
  }

  async updateById(id: string, data: any) {
    return this.defaultUpdateById(id, data);
  }

  /**
   * Finds the diff between current state and update being made. It assumes
   * all keys should be compared except the keys to exclude. By default this is set
   * timestamp columns as those should not really matter.
   */
  getUpdateDiff(
    prevModel: any,
    update: any,
    options: {
      exclude?: string[];
      include?: string[];
      // whether address should be evaluated as single unit
      parseAddress?: boolean;
    } = {}
  ) {
    const currModel = {
      ...prevModel,
      ...update,
    };
    let diffKeys = options.include ? options.include : Object.keys(currModel);

    if (options.exclude) {
      diffKeys = diffKeys.filter(
        (key) => !(options.exclude || []).includes(key)
      );
    }

    let includeAddressDiff = false;
    if (options.parseAddress) {
      const hasAddressKeys = diffKeys.some((key) => key.startsWith('address'));
      if (hasAddressKeys) {
        diffKeys = diffKeys.filter((key) => !key.startsWith('address'));
        includeAddressDiff = true;
      }
    }

    const diff = diffKeys.reduce((acc, key) => {
      const prevVal = prevModel[key];
      const currVal = currModel[key];

      if (prevVal !== currVal && (prevVal || currVal)) {
        acc.push({
          key,
          previousValue: prevVal,
          currentValue: currVal,
        });
      }

      return acc;
    }, [] as Diff[]);

    // i hate this...
    if (includeAddressDiff) {
      diff.push({
        key: 'address',
        previousValue: `${prevModel.address_street} ${prevModel.address_city}
        ${prevModel.address_state ? ',' : ''} ${prevModel.address_state} ${
          prevModel.address_postalcode
        } ${prevModel.address_country}`,
        currentValue: `${update.address_street} ${update.address_city}
        ${update.address_state ? ',' : ''} ${update.address_state} ${
          update.address_postalcode
        } ${update.address_country}`,
      });
    }

    return diff;
  }
}

export function feedLogServiceFactory(user: AuthUser) {
  return new FeedLogService(Feed, user);
}
