SELECT properties.id, properties.title, properties.cost_per_night, start_date, avg(rating) as average_rating
FROM reservations
JOIN property_reviews ON reservations.property_id = property_reviews.property_id
JOIN properties ON reservations.property_id = properties.id
WHERE reservations.guest_id = 1
AND end_date < Now()
GROUP BY reservations.id, properties.id, start_date
ORDER BY start_date
LIMIT 10;