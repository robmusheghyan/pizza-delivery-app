import * as _ from 'lodash';
import { HttpParams } from '@angular/common/http';

export const prepareTimeForRequest = (time: any) => {
  const _time = _.cloneDeep(time);
  return _time.utc(true).toISOString();
};

export const createPaginationRequest = (req?: any, post?: boolean) => {
  const options: any = {};
  if (req) {
    const paramsObj: any = {};
    if (req.offset) {
      paramsObj.offset = req.offset;
    }
    if (req.limit) {
      paramsObj.limit = req.limit;
    }
    if (req.sort) {
      paramsObj.sort = req.sort;
    }
    if (!post) {
      options.params = new HttpParams({fromObject: paramsObj});
      return options;
    } else {
      return paramsObj;
    }
  }
  return options;
};

export const createRequestOptions = (req?: any, post?: boolean) => {

  if (req) {
    const paramsObj: any = {...req};
    if (!post) {
      const params = new HttpParams({fromObject: paramsObj});
      return params;
    } else {
      return paramsObj;
    }
  }
};
