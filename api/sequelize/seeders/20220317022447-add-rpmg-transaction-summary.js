'use strict';

const { Op } = require('sequelize');
const uuid = require('uuid').v4;

const TABLE = 'rpmg_transaction_summary';

const seed = [
  // 'Agriculture'
  // < 2500
  {
    id: uuid(),
    rpmg_vertical_id: '8e427c07-620e-499d-900b-c3f37f78c397',
    rpmg_transaction_id: '62861b34-d50b-442f-ad4a-79ae47bf91ec',
    all_card_platforms: 51,
    checks: 30,
    ach: 18,
    wire_transfer: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 2501-10000
  {
    id: uuid(),
    rpmg_vertical_id: '8e427c07-620e-499d-900b-c3f37f78c397',
    rpmg_transaction_id: '2b4ac706-e424-467a-be27-001bdfb4eb27',
    all_card_platforms: 39,
    checks: 34,
    ach: 25,
    wire_transfer: 2,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 10001-100000
  {
    id: uuid(),
    rpmg_vertical_id: '8e427c07-620e-499d-900b-c3f37f78c397',
    rpmg_transaction_id: 'c47b1804-99a2-44f6-a0f5-553bd6ad4957',
    all_card_platforms: 12,
    checks: 36,
    ach: 44,
    wire_transfer: 8,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // >100001
  {
    id: uuid(),
    rpmg_vertical_id: '8e427c07-620e-499d-900b-c3f37f78c397',
    rpmg_transaction_id: 'b3ecff57-6bd8-47df-859e-f6977ad1c2ad',
    all_card_platforms: 4,
    checks: 35,
    ach: 51,
    wire_transfer: 10,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 'Ancillary agri-business services'
  // < 2500
  {
    id: uuid(),
    rpmg_vertical_id: '1236642a-0fe7-42bd-b714-c2ee58c63288',
    rpmg_transaction_id: '62861b34-d50b-442f-ad4a-79ae47bf91ec',
    all_card_platforms: 48,
    checks: 37,
    ach: 13,
    wire_transfer: 2,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 2501-10000
  {
    id: uuid(),
    rpmg_vertical_id: '1236642a-0fe7-42bd-b714-c2ee58c63288',
    rpmg_transaction_id: '2b4ac706-e424-467a-be27-001bdfb4eb27',
    all_card_platforms: 33,
    checks: 43,
    ach: 20,
    wire_transfer: 4,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 10001-100000
  {
    id: uuid(),
    rpmg_vertical_id: '1236642a-0fe7-42bd-b714-c2ee58c63288',
    rpmg_transaction_id: 'c47b1804-99a2-44f6-a0f5-553bd6ad4957',
    all_card_platforms: 12,
    checks: 49,
    ach: 30,
    wire_transfer: 9,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // >100001
  {
    id: uuid(),
    rpmg_vertical_id: '1236642a-0fe7-42bd-b714-c2ee58c63288',
    rpmg_transaction_id: 'b3ecff57-6bd8-47df-859e-f6977ad1c2ad',
    all_card_platforms: 4,
    checks: 63,
    ach: 29,
    wire_transfer: 4,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 'Construction'
  // < 2500
  {
    id: uuid(),
    rpmg_vertical_id: 'a6ebf4ee-86c8-4ca2-b316-aa5983b0894d',
    rpmg_transaction_id: '62861b34-d50b-442f-ad4a-79ae47bf91ec',
    all_card_platforms: 50,
    checks: 41,
    ach: 8,
    wire_transfer: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 2501-10000
  {
    id: uuid(),
    rpmg_vertical_id: 'a6ebf4ee-86c8-4ca2-b316-aa5983b0894d',
    rpmg_transaction_id: '2b4ac706-e424-467a-be27-001bdfb4eb27',
    all_card_platforms: 36,
    checks: 49,
    ach: 13,
    wire_transfer: 2,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 10001-100000
  {
    id: uuid(),
    rpmg_vertical_id: 'a6ebf4ee-86c8-4ca2-b316-aa5983b0894d',
    rpmg_transaction_id: 'c47b1804-99a2-44f6-a0f5-553bd6ad4957',
    all_card_platforms: 14,
    checks: 62,
    ach: 16,
    wire_transfer: 8,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // >100001
  {
    id: uuid(),
    rpmg_vertical_id: 'a6ebf4ee-86c8-4ca2-b316-aa5983b0894d',
    rpmg_transaction_id: 'b3ecff57-6bd8-47df-859e-f6977ad1c2ad',
    all_card_platforms: 6,
    checks: 83,
    ach: 6,
    wire_transfer: 5,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 'Education'
  // < 2500
  {
    id: uuid(),
    rpmg_vertical_id: 'ee8cf2b4-c54b-471f-affd-5b7fcbfcdb85',
    rpmg_transaction_id: '62861b34-d50b-442f-ad4a-79ae47bf91ec',
    all_card_platforms: 57,
    checks: 33,
    ach: 9,
    wire_transfer: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 2501-10000
  {
    id: uuid(),
    rpmg_vertical_id: 'ee8cf2b4-c54b-471f-affd-5b7fcbfcdb85',
    rpmg_transaction_id: '2b4ac706-e424-467a-be27-001bdfb4eb27',
    all_card_platforms: 31,
    checks: 54,
    ach: 13,
    wire_transfer: 2,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 10001-100000
  {
    id: uuid(),
    rpmg_vertical_id: 'ee8cf2b4-c54b-471f-affd-5b7fcbfcdb85',
    rpmg_transaction_id: 'c47b1804-99a2-44f6-a0f5-553bd6ad4957',
    all_card_platforms: 12,
    checks: 64,
    ach: 19,
    wire_transfer: 5,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // >100001
  {
    id: uuid(),
    rpmg_vertical_id: 'ee8cf2b4-c54b-471f-affd-5b7fcbfcdb85',
    rpmg_transaction_id: 'b3ecff57-6bd8-47df-859e-f6977ad1c2ad',
    all_card_platforms: 5,
    checks: 76,
    ach: 15,
    wire_transfer: 4,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 'Finance and insurance'
  // < 2500
  {
    id: uuid(),
    rpmg_vertical_id: '4bc8178b-db64-460e-934e-75f6f710af57',
    rpmg_transaction_id: '62861b34-d50b-442f-ad4a-79ae47bf91ec',
    all_card_platforms: 58,
    checks: 27,
    ach: 13,
    wire_transfer: 2,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 2501-10000
  {
    id: uuid(),
    rpmg_vertical_id: '4bc8178b-db64-460e-934e-75f6f710af57',
    rpmg_transaction_id: '2b4ac706-e424-467a-be27-001bdfb4eb27',
    all_card_platforms: 37,
    checks: 36,
    ach: 23,
    wire_transfer: 4,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 10001-100000
  {
    id: uuid(),
    rpmg_vertical_id: '4bc8178b-db64-460e-934e-75f6f710af57',
    rpmg_transaction_id: 'c47b1804-99a2-44f6-a0f5-553bd6ad4957',
    all_card_platforms: 14,
    checks: 44,
    ach: 31,
    wire_transfer: 11,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // >100001
  {
    id: uuid(),
    rpmg_vertical_id: '4bc8178b-db64-460e-934e-75f6f710af57',
    rpmg_transaction_id: 'b3ecff57-6bd8-47df-859e-f6977ad1c2ad',
    all_card_platforms: 7,
    checks: 55,
    ach: 28,
    wire_transfer: 10,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 'Freight and transport'
  // < 2500
  {
    id: uuid(),
    rpmg_vertical_id: 'a7bd3a5d-3ae3-485b-8e82-5bb26e91ab30',
    rpmg_transaction_id: '62861b34-d50b-442f-ad4a-79ae47bf91ec',
    all_card_platforms: 52,
    checks: 30,
    ach: 16,
    wire_transfer: 2,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 2501-10000
  {
    id: uuid(),
    rpmg_vertical_id: 'a7bd3a5d-3ae3-485b-8e82-5bb26e91ab30',
    rpmg_transaction_id: '2b4ac706-e424-467a-be27-001bdfb4eb27',
    all_card_platforms: 34,
    checks: 37,
    ach: 23,
    wire_transfer: 6,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 10001-100000
  {
    id: uuid(),
    rpmg_vertical_id: 'a7bd3a5d-3ae3-485b-8e82-5bb26e91ab30',
    rpmg_transaction_id: 'c47b1804-99a2-44f6-a0f5-553bd6ad4957',
    all_card_platforms: 12,
    checks: 42,
    ach: 36,
    wire_transfer: 10,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // >100001
  {
    id: uuid(),
    rpmg_vertical_id: 'a7bd3a5d-3ae3-485b-8e82-5bb26e91ab30',
    rpmg_transaction_id: 'b3ecff57-6bd8-47df-859e-f6977ad1c2ad',
    all_card_platforms: 9,
    checks: 48,
    ach: 37,
    wire_transfer: 6,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 'Government'
  // < 2500
  {
    id: uuid(),
    rpmg_vertical_id: '7874a799-914b-4be5-aa6e-97dcfe572e53',
    rpmg_transaction_id: '62861b34-d50b-442f-ad4a-79ae47bf91ec',
    all_card_platforms: 51,
    checks: 38,
    ach: 10,
    wire_transfer: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 2501-10000
  {
    id: uuid(),
    rpmg_vertical_id: '7874a799-914b-4be5-aa6e-97dcfe572e53',
    rpmg_transaction_id: '2b4ac706-e424-467a-be27-001bdfb4eb27',
    all_card_platforms: 31,
    checks: 54,
    ach: 13,
    wire_transfer: 2,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 10001-100000
  {
    id: uuid(),
    rpmg_vertical_id: '7874a799-914b-4be5-aa6e-97dcfe572e53',
    rpmg_transaction_id: 'c47b1804-99a2-44f6-a0f5-553bd6ad4957',
    all_card_platforms: 9,
    checks: 65,
    ach: 19,
    wire_transfer: 7,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // >100001
  {
    id: uuid(),
    rpmg_vertical_id: '7874a799-914b-4be5-aa6e-97dcfe572e53',
    rpmg_transaction_id: 'b3ecff57-6bd8-47df-859e-f6977ad1c2ad',
    all_card_platforms: 5,
    checks: 62,
    ach: 21,
    wire_transfer: 12,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 'Healthcare'
  // < 2500
  {
    id: uuid(),
    rpmg_vertical_id: '77f7131f-1ca1-4099-8a16-8df64437f95a',
    rpmg_transaction_id: '62861b34-d50b-442f-ad4a-79ae47bf91ec',
    all_card_platforms: 47,
    checks: 43,
    ach: 9,
    wire_transfer: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 2501-10000
  {
    id: uuid(),
    rpmg_vertical_id: '77f7131f-1ca1-4099-8a16-8df64437f95a',
    rpmg_transaction_id: '2b4ac706-e424-467a-be27-001bdfb4eb27',
    all_card_platforms: 33,
    checks: 51,
    ach: 13,
    wire_transfer: 3,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 10001-100000
  {
    id: uuid(),
    rpmg_vertical_id: '77f7131f-1ca1-4099-8a16-8df64437f95a',
    rpmg_transaction_id: 'c47b1804-99a2-44f6-a0f5-553bd6ad4957',
    all_card_platforms: 15,
    checks: 58,
    ach: 20,
    wire_transfer: 7,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // >100001
  {
    id: uuid(),
    rpmg_vertical_id: '77f7131f-1ca1-4099-8a16-8df64437f95a',
    rpmg_transaction_id: 'b3ecff57-6bd8-47df-859e-f6977ad1c2ad',
    all_card_platforms: 10,
    checks: 56,
    ach: 29,
    wire_transfer: 5,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 'Manufacturing'
  // < 2500
  {
    id: uuid(),
    rpmg_vertical_id: '4d375e09-a9f0-4d16-bf9c-7694da6208ea',
    rpmg_transaction_id: '62861b34-d50b-442f-ad4a-79ae47bf91ec',
    all_card_platforms: 49,
    checks: 32,
    ach: 17,
    wire_transfer: 2,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 2501-10000
  {
    id: uuid(),
    rpmg_vertical_id: '4d375e09-a9f0-4d16-bf9c-7694da6208ea',
    rpmg_transaction_id: '2b4ac706-e424-467a-be27-001bdfb4eb27',
    all_card_platforms: 34,
    checks: 38,
    ach: 23,
    wire_transfer: 5,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 10001-100000
  {
    id: uuid(),
    rpmg_vertical_id: '4d375e09-a9f0-4d16-bf9c-7694da6208ea',
    rpmg_transaction_id: 'c47b1804-99a2-44f6-a0f5-553bd6ad4957',
    all_card_platforms: 13,
    checks: 44,
    ach: 32,
    wire_transfer: 11,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // >100001
  {
    id: uuid(),
    rpmg_vertical_id: '4d375e09-a9f0-4d16-bf9c-7694da6208ea',
    rpmg_transaction_id: 'b3ecff57-6bd8-47df-859e-f6977ad1c2ad',
    all_card_platforms: 10,
    checks: 38,
    ach: 29,
    wire_transfer: 23,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 'Non-profit'
  // < 2500
  {
    id: uuid(),
    rpmg_vertical_id: '6813a448-7d94-4f48-b259-1ebb9ba49666',
    rpmg_transaction_id: '62861b34-d50b-442f-ad4a-79ae47bf91ec',
    all_card_platforms: 46,
    checks: 40,
    ach: 12,
    wire_transfer: 2,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 2501-10000
  {
    id: uuid(),
    rpmg_vertical_id: '6813a448-7d94-4f48-b259-1ebb9ba49666',
    rpmg_transaction_id: '2b4ac706-e424-467a-be27-001bdfb4eb27',
    all_card_platforms: 28,
    checks: 52,
    ach: 16,
    wire_transfer: 4,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 10001-100000
  {
    id: uuid(),
    rpmg_vertical_id: '6813a448-7d94-4f48-b259-1ebb9ba49666',
    rpmg_transaction_id: 'c47b1804-99a2-44f6-a0f5-553bd6ad4957',
    all_card_platforms: 13,
    checks: 56,
    ach: 23,
    wire_transfer: 8,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // >100001
  {
    id: uuid(),
    rpmg_vertical_id: '6813a448-7d94-4f48-b259-1ebb9ba49666',
    rpmg_transaction_id: 'b3ecff57-6bd8-47df-859e-f6977ad1c2ad',
    all_card_platforms: 9,
    checks: 56,
    ach: 31,
    wire_transfer: 4,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 'Senior care and housing'
  // < 2500
  {
    id: uuid(),
    rpmg_vertical_id: 'e0da9be7-1496-4118-9030-9f35c73f7b8e',
    rpmg_transaction_id: '62861b34-d50b-442f-ad4a-79ae47bf91ec',
    all_card_platforms: 44,
    checks: 45,
    ach: 9,
    wire_transfer: 2,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 2501-10000
  {
    id: uuid(),
    rpmg_vertical_id: 'e0da9be7-1496-4118-9030-9f35c73f7b8e',
    rpmg_transaction_id: '2b4ac706-e424-467a-be27-001bdfb4eb27',
    all_card_platforms: 26,
    checks: 62,
    ach: 10,
    wire_transfer: 2,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 10001-100000
  {
    id: uuid(),
    rpmg_vertical_id: 'e0da9be7-1496-4118-9030-9f35c73f7b8e',
    rpmg_transaction_id: 'c47b1804-99a2-44f6-a0f5-553bd6ad4957',
    all_card_platforms: 10,
    checks: 65,
    ach: 20,
    wire_transfer: 5,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // >100001
  {
    id: uuid(),
    rpmg_vertical_id: 'e0da9be7-1496-4118-9030-9f35c73f7b8e',
    rpmg_transaction_id: 'b3ecff57-6bd8-47df-859e-f6977ad1c2ad',
    all_card_platforms: 5,
    checks: 62,
    ach: 28,
    wire_transfer: 5,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 'Software'
  // < 2500
  {
    id: uuid(),
    rpmg_vertical_id: '0b68fe0c-a8e1-4ef3-a955-378f0d9d097f',
    rpmg_transaction_id: '62861b34-d50b-442f-ad4a-79ae47bf91ec',
    all_card_platforms: 58,
    checks: 24,
    ach: 15,
    wire_transfer: 3,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 2501-10000
  {
    id: uuid(),
    rpmg_vertical_id: '0b68fe0c-a8e1-4ef3-a955-378f0d9d097f',
    rpmg_transaction_id: '2b4ac706-e424-467a-be27-001bdfb4eb27',
    all_card_platforms: 38,
    checks: 35,
    ach: 23,
    wire_transfer: 4,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 10001-100000
  {
    id: uuid(),
    rpmg_vertical_id: '0b68fe0c-a8e1-4ef3-a955-378f0d9d097f',
    rpmg_transaction_id: 'c47b1804-99a2-44f6-a0f5-553bd6ad4957',
    all_card_platforms: 12,
    checks: 45,
    ach: 31,
    wire_transfer: 12,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // >100001
  {
    id: uuid(),
    rpmg_vertical_id: '0b68fe0c-a8e1-4ef3-a955-378f0d9d097f',
    rpmg_transaction_id: 'b3ecff57-6bd8-47df-859e-f6977ad1c2ad',
    all_card_platforms: 5,
    checks: 30,
    ach: 49,
    wire_transfer: 16,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 'Tourism'
  // < 2500
  {
    id: uuid(),
    rpmg_vertical_id: '69633c6c-82ae-49ec-a38b-50f62a7e5a82',
    rpmg_transaction_id: '62861b34-d50b-442f-ad4a-79ae47bf91ec',
    all_card_platforms: 56,
    checks: 34,
    ach: 9,
    wire_transfer: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 2501-10000
  {
    id: uuid(),
    rpmg_vertical_id: '69633c6c-82ae-49ec-a38b-50f62a7e5a82',
    rpmg_transaction_id: '2b4ac706-e424-467a-be27-001bdfb4eb27',
    all_card_platforms: 42,
    checks: 44,
    ach: 11,
    wire_transfer: 3,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 10001-100000
  {
    id: uuid(),
    rpmg_vertical_id: '69633c6c-82ae-49ec-a38b-50f62a7e5a82',
    rpmg_transaction_id: 'c47b1804-99a2-44f6-a0f5-553bd6ad4957',
    all_card_platforms: 14,
    checks: 60,
    ach: 12,
    wire_transfer: 14,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // >100001
  {
    id: uuid(),
    rpmg_vertical_id: '69633c6c-82ae-49ec-a38b-50f62a7e5a82',
    rpmg_transaction_id: 'b3ecff57-6bd8-47df-859e-f6977ad1c2ad',
    all_card_platforms: 9,
    checks: 74,
    ach: 9,
    wire_transfer: 8,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 'Utilities'
  // < 2500
  {
    id: uuid(),
    rpmg_vertical_id: '708643f1-5f11-47d1-bb86-757b236e355e',
    rpmg_transaction_id: '62861b34-d50b-442f-ad4a-79ae47bf91ec',
    all_card_platforms: 49,
    checks: 37,
    ach: 13,
    wire_transfer: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 2501-10000
  {
    id: uuid(),
    rpmg_vertical_id: '708643f1-5f11-47d1-bb86-757b236e355e',
    rpmg_transaction_id: '2b4ac706-e424-467a-be27-001bdfb4eb27',
    all_card_platforms: 29,
    checks: 48,
    ach: 21,
    wire_transfer: 2,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 10001-100000
  {
    id: uuid(),
    rpmg_vertical_id: '708643f1-5f11-47d1-bb86-757b236e355e',
    rpmg_transaction_id: 'c47b1804-99a2-44f6-a0f5-553bd6ad4957',
    all_card_platforms: 13,
    checks: 45,
    ach: 36,
    wire_transfer: 6,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // >100001
  {
    id: uuid(),
    rpmg_vertical_id: '708643f1-5f11-47d1-bb86-757b236e355e',
    rpmg_transaction_id: 'b3ecff57-6bd8-47df-859e-f6977ad1c2ad',
    all_card_platforms: 9,
    checks: 66,
    ach: 18,
    wire_transfer: 7,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 'Wholesalers'
  // < 2500
  {
    id: uuid(),
    rpmg_vertical_id: 'ff22f961-9b5f-45fd-ada8-18790594b21b',
    rpmg_transaction_id: '62861b34-d50b-442f-ad4a-79ae47bf91ec',
    all_card_platforms: 48,
    checks: 40,
    ach: 10,
    wire_transfer: 2,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 2501-10000
  {
    id: uuid(),
    rpmg_vertical_id: 'ff22f961-9b5f-45fd-ada8-18790594b21b',
    rpmg_transaction_id: '2b4ac706-e424-467a-be27-001bdfb4eb27',
    all_card_platforms: 33,
    checks: 48,
    ach: 16,
    wire_transfer: 3,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 10001-100000
  {
    id: uuid(),
    rpmg_vertical_id: 'ff22f961-9b5f-45fd-ada8-18790594b21b',
    rpmg_transaction_id: 'c47b1804-99a2-44f6-a0f5-553bd6ad4957',
    all_card_platforms: 11,
    checks: 49,
    ach: 28,
    wire_transfer: 12,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // >100001
  {
    id: uuid(),
    rpmg_vertical_id: 'ff22f961-9b5f-45fd-ada8-18790594b21b',
    rpmg_transaction_id: 'b3ecff57-6bd8-47df-859e-f6977ad1c2ad',
    all_card_platforms: 8,
    checks: 48,
    ach: 31,
    wire_transfer: 13,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 'Blended rate'
  // < 2500
  {
    id: uuid(),
    rpmg_vertical_id: '1a7eed4c-113b-42a3-b769-36626dac845c',
    rpmg_transaction_id: '62861b34-d50b-442f-ad4a-79ae47bf91ec',
    all_card_platforms: 51,
    checks: 37,
    ach: 11,
    wire_transfer: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 2501-10000
  {
    id: uuid(),
    rpmg_vertical_id: '1a7eed4c-113b-42a3-b769-36626dac845c',
    rpmg_transaction_id: '2b4ac706-e424-467a-be27-001bdfb4eb27',
    all_card_platforms: 37,
    checks: 44,
    ach: 16,
    wire_transfer: 3,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 10001-100000
  {
    id: uuid(),
    rpmg_vertical_id: '1a7eed4c-113b-42a3-b769-36626dac845c',
    rpmg_transaction_id: 'c47b1804-99a2-44f6-a0f5-553bd6ad4957',
    all_card_platforms: 15,
    checks: 50,
    ach: 24,
    wire_transfer: 11,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // >100001
  {
    id: uuid(),
    rpmg_vertical_id: '1a7eed4c-113b-42a3-b769-36626dac845c',
    rpmg_transaction_id: 'b3ecff57-6bd8-47df-859e-f6977ad1c2ad',
    all_card_platforms: 6,
    checks: 73,
    ach: 14,
    wire_transfer: 7,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 'All Organizations'
  // < 2500
  {
    id: uuid(),
    rpmg_vertical_id: '2b03ae0a-9266-4fb2-adee-18a0be603692',
    rpmg_transaction_id: '62861b34-d50b-442f-ad4a-79ae47bf91ec',
    all_card_platforms: 52,
    checks: 35,
    ach: 11,
    wire_transfer: 2,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 2501-10000
  {
    id: uuid(),
    rpmg_vertical_id: '2b03ae0a-9266-4fb2-adee-18a0be603692',
    rpmg_transaction_id: '2b4ac706-e424-467a-be27-001bdfb4eb27',
    all_card_platforms: 33,
    checks: 48,
    ach: 16,
    wire_transfer: 3,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // 10001-100000
  {
    id: uuid(),
    rpmg_vertical_id: '2b03ae0a-9266-4fb2-adee-18a0be603692',
    rpmg_transaction_id: 'c47b1804-99a2-44f6-a0f5-553bd6ad4957',
    all_card_platforms: 13,
    checks: 55,
    ach: 24,
    wire_transfer: 8,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // >100001
  {
    id: uuid(),
    rpmg_vertical_id: '2b03ae0a-9266-4fb2-adee-18a0be603692',
    rpmg_transaction_id: 'b3ecff57-6bd8-47df-859e-f6977ad1c2ad',
    all_card_platforms: 8,
    checks: 57,
    ach: 25,
    wire_transfer: 10,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      return queryInterface.bulkInsert(TABLE, seed, {});
    } catch (error) {
      console.error(error);
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};


