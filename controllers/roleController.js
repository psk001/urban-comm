const { Snowflake } = require("@theinternetfolks/snowflake");

const { Role } = require("../models/roleModel");
const { Success, Error } = require("../utils/response");


async function getAllRole(req, res) {
  try {
    const pageSize = process.env.PAGE_SIZE;
    const pageNumber = parseInt(req.query["page"]) || 1;

    const totalRoleCount = await Role.countDocuments();

    const skipDocuments = (pageNumber - 1) * pageSize;

    const roles = await Role.find().skip(skipDocuments).limit(pageSize);
    console.log(roles);

    const roleResponseObject = {
      meta: {
        total: totalRoleCount,
        pages: Math.ceil(totalRoleCount/pageSize),
        page: pageNumber
      },
      data: roles
    };

    return res.send(new Success(roleResponseObject));
  } catch (error) {
    console.error(error.message);
    return res.status(400).send(new Error("Could not get role"));
  }
}

async function createRole(req, res) {
  try {
    const { name } = req.body;

    let role = await Role.findOne({ name: name }); 

    if (role) {
      return res.send(new Error("Role already exists"));
    }

    role = new Role({
      id: Snowflake.generate(),
      name,
    });
    await role.save();

    const {id, created_at, updated_at}= role;

    const responseObject = {
      data: {
        id,
        name,
        created_at,
        updated_at
      },
    };

    return res.send(new Success(responseObject));
  } catch (error) {
    console.error(error.message);
    return res.status(400).send(new Error("Could not create role"));
  }
}

module.exports= {
    getAllRole,
    createRole
}