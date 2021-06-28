
CREATE TABLE answers
(
  id          SERIAL       NOT NULL COMMENT 'ID de cada respuesta',
  answer      TEXT         NOT NULL COMMENT 'Texto de respuesta',
  votes       DECIMAL(10)  NOT NULL DEFAULT 0 COMMENT 'Votos de cada respuesta',
  email_user  VARCHAR(256) NOT NULL COMMENT 'Correo electrónico',
  id_question BIGINT UNSIGNED NOT NULL COMMENT 'ID de cada pregunta.',
  PRIMARY KEY (id)
) COMMENT 'Respuestas a cada pregunta';

ALTER TABLE answers
  ADD CONSTRAINT UQ_id UNIQUE (id);

ALTER TABLE answers
  ADD CONSTRAINT UQ_email_user UNIQUE (email_user);

CREATE TABLE career
(
  id        SERIAL       NOT NULL,
  name      VARCHAR(256) NOT NULL,
  id_school BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (id)
);

ALTER TABLE career
  ADD CONSTRAINT UQ_id UNIQUE (id);

CREATE TABLE courses
(
  id        SERIAL       NOT NULL,
  name      VARCHAR(256) NOT NULL,
  id_career BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (id)
);

ALTER TABLE courses
  ADD CONSTRAINT UQ_id UNIQUE (id);

CREATE TABLE questions
(
  id         SERIAL       NOT NULL COMMENT 'ID de cada pregunta.',
  votes      DECIMAL(10)  NOT NULL DEFAULT 0 COMMENT 'Votos de cada pregunta',
  question   TEXT         NOT NULL COMMENT 'Texto de la pregunta',
  email_user VARCHAR(256) NOT NULL COMMENT 'Correo electrónico',
  id_courses BIGINT UNSIGNED NOT NULL,
  state      BOOLEAN      NOT NULL DEFAULT 1,
  PRIMARY KEY (id)
) COMMENT 'La tabla de preguntas';

ALTER TABLE questions
  ADD CONSTRAINT UQ_id UNIQUE (id);

ALTER TABLE questions
  ADD CONSTRAINT UQ_email_user UNIQUE (email_user);

CREATE TABLE school
(
  id   SERIAL       NOT NULL,
  name VARCHAR(256) NOT NULL,
  PRIMARY KEY (id)
);

ALTER TABLE school
  ADD CONSTRAINT UQ_id UNIQUE (id);

CREATE TABLE users
(
  email    VARCHAR(256) NOT NULL COMMENT 'Correo electrónico',
  password VARCHAR(30)  NOT NULL COMMENT 'Contraseña',
  rol      DECIMAL(1)   NOT NULL DEFAULT 0 COMMENT 'Roles: 0 para alumnos, 1 para ayudantes y 2 para profesores',
  name     VARCHAR(256) NOT NULL COMMENT 'Nombre del usuario',
  rut      VARCHAR(10)  NOT NULL COMMENT 'Rut del usuario',
  PRIMARY KEY (email)
) COMMENT 'La tabla de los usuarios del sistema';

ALTER TABLE users
  ADD CONSTRAINT UQ_email UNIQUE (email);

ALTER TABLE users
  ADD CONSTRAINT UQ_rut UNIQUE (rut);

CREATE TABLE users_courses
(
  email_user VARCHAR(256) NOT NULL COMMENT 'Correo electrónico',
  id_courses SERIAL       NOT NULL
);

ALTER TABLE questions
  ADD CONSTRAINT FK_users_TO_questions
    FOREIGN KEY (email_user)
    REFERENCES users (email);

ALTER TABLE answers
  ADD CONSTRAINT FK_users_TO_answers
    FOREIGN KEY (email_user)
    REFERENCES users (email);

ALTER TABLE questions
  ADD CONSTRAINT FK_courses_TO_questions
    FOREIGN KEY (id_courses)
    REFERENCES courses (id);

ALTER TABLE users_courses
  ADD CONSTRAINT FK_users_TO_users_courses
    FOREIGN KEY (email_user)
    REFERENCES users (email);

ALTER TABLE users_courses
  ADD CONSTRAINT FK_courses_TO_users_courses
    FOREIGN KEY (id_courses)
    REFERENCES courses (id);

ALTER TABLE courses
  ADD CONSTRAINT FK_career_TO_courses
    FOREIGN KEY (id_career)
    REFERENCES career (id);

ALTER TABLE career
  ADD CONSTRAINT FK_school_TO_career
    FOREIGN KEY (id_school)
    REFERENCES school (id);

ALTER TABLE answers
  ADD CONSTRAINT FK_questions_TO_answers
    FOREIGN KEY (id_question)
    REFERENCES questions (id);
