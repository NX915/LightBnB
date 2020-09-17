const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});
/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
// const getUserWithEmail = function(email) {
//   let user;
//   for (const userId in users) {
//     user = users[userId];
//     if (user.email.toLowerCase() === email.toLowerCase()) {
//       break;
//     } else {
//       user = null;
//     }
//   }
//   return Promise.resolve(user);
// }
const getUserWithEmail = function(email) {
  return pool.query(`
  SELECT * FROM users
  WHERE email = $1;
  `, [email])
    .then(res => {
      return res.rows[0];
    })
    .catch(err => console.log('email query error ', err.message));
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
// const getUserWithId = function(id) {
//   return Promise.resolve(users[id]);
// }
const getUserWithId = function(id) {
  return pool.query(`
  SELECT * FROM users
  WHERE id = $1;
  `, [id])
    .then(res => {
      return res.rows[0];
    })
    .catch(err => console.log('id query error ', err.message));
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
// const addUser =  function(user) {
//   const userId = Object.keys(users).length + 1;
//   user.id = userId;
//   users[userId] = user;
//   return Promise.resolve(user);
// }
const addUser =  function(user) {
  return pool.query(`
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;
  `,[user.name, user.email, user.password])
    .then(res => {
      return res.rows[0];
    })
    .catch(err => console.log('new user query error ', err.message));
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
// const getAllReservations = function(guest_id, limit = 10) {
//   return getAllProperties(null, 2);
// }
const getAllReservations = function(guest_id, limit = 10) {
  return pool.query(`
    SELECT properties.*, reservations.*, avg(rating) as average_rating
    FROM reservations
    JOIN property_reviews ON reservations.property_id = property_reviews.property_id
    JOIN properties ON reservations.property_id = properties.id
    WHERE reservations.guest_id = $1
    AND end_date < Now()
    GROUP BY reservations.id, properties.id, start_date
    ORDER BY start_date
    LIMIT $2;
  `, [guest_id, limit])
    .then(res => {
      return res.rows;
    })
    .catch(err => console.log('get reservation error ', err.message));
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
// const getAllProperties = function(options, limit = 10) {
//   const limitedProperties = {};
//   for (let i = 1; i <= limit; i++) {
//     limitedProperties[i] = properties[i];
//   }
//   return Promise.resolve(limitedProperties);
// }
const getAllProperties = function(options, limit = 10) {
  console.log(options);
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // 3
  if (Object.keys(options).length > 0) {
    queryString += `WHERE `;
    if (options.city) {
      queryParams.push(`%${options.city}%`);
      queryString += `lower(city) LIKE lower($${queryParams.length}) `;
    }
  
    if (options.owner_id) {
      if (queryParams.length > 0) queryString += `AND `;
      queryParams.push(options.owner_id);
      queryString += `owner_id = $${queryParams.length} `;
    }

    if (options.minimum_price_per_night) {
      if (queryParams.length > 0) queryString += `AND `;
      queryParams.push(options.minimum_price_per_night * 100);
      queryString += `cost_per_night >= $${queryParams.length} `;
    }

    if (options.maximum_price_per_night) {
      if (queryParams.length > 0) queryString += `AND `;
      queryParams.push(options.maximum_price_per_night * 100);
      queryString += `cost_per_night <= $${queryParams.length} `;
    }
  }

  queryString += `
  GROUP BY properties.id
  `;

  if (options.minimum_rating) {
    queryParams.push(parseInt(options.minimum_rating));
    queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length} `;
  }

  // 4
  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log('string: ', queryString, 'param: ', queryParams);

  // 6
  return pool.query(queryString, queryParams)
    .then(res => res.rows)
    .catch(err => console.log('search query error', err.stack));
};
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
