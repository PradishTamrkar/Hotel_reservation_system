const { QueryTypes } = require("sequelize");
const sequelize = require("../config/db");
const CustomerTestimony = require("../models/customerTestimony");

const sqlTestimony = `
SELECT
  t.comment,
  t.rating,
  c.first_name || COALESCE(' ' || c.middle_name, '') || ' ' || c.last_name AS customer_name
FROM customer_testimonies t
JOIN customer c ON t.customer_id = c.customer_id
`;

// create testimony
const createCustomerTestimony = async (data, user) => {
  const { comment, rating } = data;
  const customer_id = user.id;

  if (!comment) throw new Error("Comment is required");
  if (!user || user.role !== "customer")
    throw new Error("Only registered customers can post testimonies");

  const [customer] = await sequelize.query(
    `
    SELECT first_name, middle_name, last_name
    FROM customer WHERE customer_id = :id
    `,
    {
      replacements: { id: user.id },
      type: QueryTypes.SELECT,
    }
  );

  if (!customer) throw new Error("Customer not found");

  const testimony = await CustomerTestimony.create({
    comment,
    rating,
    customer_id,
    first_name: customer.first_name,
    middle_name: customer.middle_name,
    last_name: customer.last_name,
  });

  return testimony;
};

// get all testimony
const getAllTestimonies = async () => {
  const testimonies = await sequelize.query(sqlTestimony, { type: QueryTypes.SELECT });
  return testimonies;
};

// get testimony by id
const getTestimonyByID = async (id) => {
  const testimony = await sequelize.query(`${sqlTestimony} WHERE t.testimony_id = :id`, {
    replacements: { id },
    type: QueryTypes.SELECT,
  });
  if (!testimony.length) throw new Error("Customer Testimony not found");
  return testimony[0];
};

// update testimony
const updateTestimony = async (id, data) => {
  const testimony = await CustomerTestimony.findByPk(id);
  if (!testimony) throw new Error("Customer Testimony not found");
  await testimony.update(data);
  return testimony;
};

// delete testimony
const deleteTestimony = async (id) => {
  const testimony = await CustomerTestimony.findByPk(id);
  if (!testimony) throw new Error("Customer Testimony not found");
  await testimony.destroy();
  return "Customer Testimony deleted successfully";
};

module.exports = {
  createCustomerTestimony,
  getAllTestimonies,
  getTestimonyByID,
  updateTestimony,
  deleteTestimony,
};
