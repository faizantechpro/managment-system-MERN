import { Context } from './Context';
import { BizOpts } from './types';

export class Biz extends Context {
  protected exception: BizOpts['exception'];

  constructor(biz: BizOpts) {
    super(biz);

    this.exception = biz.exception;
  }
}
