DELETE FROM users;
-- DELETE FROM properties;
-- DELETE FROM reservations;


INSERT INTO users (name, email, password)
VALUES ('name 1', 'email1@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('name 2', 'email2@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('name 3', 'email3@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'house 1', 'description for house 1', 'thumb url 1', 'cover url 1', 100, 1, 1, 2, 'Canada', 'Street 1', 'Toronto', 'Ontario', 'M1M 1M1', 't'),
(2, 'house 2-1', 'description for house 2-1', 'thumb url 2', 'cover url 2', 200, 1, 1, 2, 'Canada', 'Street 2', 'Toronto', 'Ontario', 'M2M 2M1', 't'),
(2, 'house 2-2', 'description for house 2-2', 'thumb url 3', 'cover url 3', 220, 1, 1, 2, 'Canada', 'Street 2', 'Toronto', 'Ontario', 'M2M 2M2', 't');

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2018-09-11', '2018-09-21', 2, 3),
('2019-04-11', '2019-05-01', 1, 2),
('2020-01-14', '2020-05-02', 2, 1);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 2, 3, 5, 'great 1'),
(2, 1, 2, 4, 'great 4'),
(3, 2, 1, 3, 'great 3');