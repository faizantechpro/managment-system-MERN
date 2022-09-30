import { Treasury } from './Treasury';

describe('./Treasury', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('Should properly calculate item savings', async () => {
    const items = {
      id: 1,
      name: 'ACH',
      total_items: 5,
      item_fee: 2500, // in tenth of cents
      proposed_item_fee: 500, // in tenth of cents
    };

    const SUT = new Treasury({ input: {} as any }, '/tmp');

    const result = (SUT as any).calculateItemSavings(items) as number;

    expect(result).toEqual((5 * 2500 - 5 * 500) * 12);
  });
});
