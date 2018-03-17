SELECT pid, pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE datname = current_database() AND pid <> pg_backend_pid();

DROP DATABASE IF EXISTS photos;
CREATE DATABASE photos;

\c photos;

DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS places;
DROP TABLE IF EXISTS reviewers;


CREATE TABLE places (
  /* Describe your table here.*/
  place_id SERIAL NOT NULL PRIMARY KEY ,
  place_name TEXT
);

CREATE TABLE reviewers (
  /* Describe your table here.*/
  reviewer_id SERIAL NOT NULL PRIMARY KEY, 
  reviewer_name TEXT, 
  reviewer_avatar TEXT
);

CREATE TABLE photos (
  /* Describe your table here.*/
  photo_id SERIAL NOT NULL PRIMARY KEY,
  url TEXT,
  width INTEGER,
  height INTEGER,
  place_id INTEGER REFERENCES places (place_id),
  reviewer_id INTEGER REFERENCES reviewers (reviewer_id) 
);


/* Create other tables and define schemas for them here! */



/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
      mysql -u student < schema.sql
      psql -U zaid -a -f schema.sql
 *  to create the database and the tables.*/

