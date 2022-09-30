# DAO

Data Access Object Pattern (DAO Pattern).

## General Info

### What is it?

Although it's being referred to as the DAO Pattern, it's really being used a combination of Data Access Objects and Persistance layer.

The DAOs should be types which define our core database models. For example:

* User from `users` table
* Course from `courses` table
* etc..

Whereas, the persistance layer is the piece that makes requests to our database. Depending on the type of request, this persistance layer will take in a DAO if creating or updating and return a DAO when querying.

### Why use it?

The main advantage is that it follows the Single Responsibility Pattern (SRP) as it keeps a strong separation between our business rules and how we store our data. We most likely will never switch database vendors but if we ever see sub-optimal queries that is impacting our response times, we are free to change how data is being queried by changing ORM library or perhaps changing to writing raw SQL. The choice is ours and this separation keeps us safe from impacting the business layer.

As a result, our DAO should have little to no business rules associated with querying. As of now, we do have a "Context" piece which tells the database to restrict queries by tenant id, user id (whether that's created by id, assigned user id, etc), and owned ids (based on owner tables) but DAO doesn't and shouldn't care where those ids are coming from. I.e., DAO doesn't perform user JWT checks or decoding, it assumes if you provide a tenant id and user id, it's safe to proceed.

And of course, there are some disadvantages that we must be aware of. The main one being code duplication and slightly more overhead as we need a bit more boilerplate code to setup a new table and DAO layer files.

## Development

The following two classes are classes you should be familiar with when working with DAO classes.

### DAO Class

See description comment for the purpose of [DAO.ts](./utils/DAO.ts).

### Where Class

See description comment for the purpose of [Where.ts](./utils/Where.ts).

### Conventions

1. A DAO must **NEVER** throw errors such as "NotFound", "Conflict, "Unauthorized", etc. DAO does not care about business rules. The only errors that would be thrown are restrictions imposed by the actual database, e.g. PK unique constraint error and the like.
2. When creating a new DAO class, please follow the following naming conventions:

* **findAll** - finds all models by some context
* **findAllBy\<field>** - finds all models by some provided field
* **findAll\<predefined meaning>** - e.g. findAllPublic means to find all models that are public
* **find** - finds all models using pagination
* **findBy\<field>** - finds all models by a restriction using pagination
* **findOneBy\<field>** - finds a single model by using PK or unique key(s)
* **updateBy\<field>** - updates model(s) by using some field
* **deleteBy\<field>** - deletes model(s) by using some field

**Q**: Isn't `get` and `find` the same though?

**A**: A `get` method implies that the function will throw errors related to RESTful, e.g. throw an error if record is not found. Whereas `find`, implies it attempts to find a record and if not found, `null` is returned.

### Boilerplate

1. Add example class structure with basic functionality (you can also create the class without methods in case you want to skip to steps 2-4):

```ts
export class MyTableDAO extends DAO<"MyTableDB"> {
  async find(
    context: ContextQuery,
    pagination: Pagination,
    query: MyTableQueryDAO
  ) {
    const builder = this.where();
    builder.context(context);

    const { count, rows } = await this.repo.findAndCountAll({
      where: builder.build(),
      ...this.getPaginationQuery(pagination),
    });

    return this.getPaginatedResponse(this.rowsToJSON(rows), count, pagination);
  }

  async findOneById(context: ContextQuery, id: string) {
    const builder = this.where();
    builder.merge({ id });
    builder.context(context);

    const model = await this.repo.findOne({
      where: builder.build(),
    });

    return this.toJSON(model);
  }

  async updateById(context: ContextQuery, id: string, payload: MyTableModifyDAO) {
    const builder = this.where();
    builder.merge({ id });
    builder.context(context);

    const [, [model]] = await this.repo.update(payload, {
      where: builder.build(),
      returning: true,
    });

    return this.toJSON(model);
  }

  async deleteById(
    context: ContextQuery,
    id: string
  ) {
    const builder = this.where();
    builder.merge({ id });
    builder.context(context);

    await this.repo.destroy({
      where: builder.build(),
      ...opts,
    });
  }
}
```

2. Add the new DAO file to [./index.ts](./index.ts). Keep the file alphabetized for consistency.

3. Add the new DAO class type to [./../middlewares/context/types.ts](./../middlewares/context/types.ts). Keep the file alphabetized for consistency.

```ts
export type ContextServices = {
  biz: {
    ....
  };
  dao: {
    ...
    myTable: MyTableDAO;
    ...
  };
};
```

4. Instantiate the DAO class in [./../middlewares/context/middleware.ts](./../middlewares/context/middleware.ts). Keep the file alphabetized for consistency.

```ts
  const services: ContextServices = {
    biz: {
      ...
    },
    dao: {
      ...
      myTable: {} as any, // needed for guest access
      ...
    },
  };

  if (req.user) {
    const db = (req as any).db as DB['models'];
    const bizOpts = {
      db,
      user: req.user,
      exception: (req as any).exception,
      services: services, // post assignment through reference
    };

    ...
    services.dao.myTable = new MyTableDAO(db.MyTableDB, bizOpts);
    ...


    // biz classes
  }  
```
