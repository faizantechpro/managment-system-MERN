# openapi/routes

Routes placed here are generic implementations. For example `Owners` functionality is identical across Contact, Deal, and Organization domains. The only difference is how we fetch owners. For contact, we use `contact_id`, deal, we use `deal_id`, etc. For this reason, the entire feature can be a generic and the route implementation can be re-used.
