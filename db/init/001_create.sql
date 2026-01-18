-- public."User" definition

-- Drop table

DROP TABLE IF EXISTS public."User";

CREATE TABLE public."User" (
	id text NOT NULL,
	isadmin bool DEFAULT false NOT NULL,
	email text NOT NULL,
	"name" text NOT NULL,
	isblocked bool DEFAULT false NOT NULL,
	profilepicturename text DEFAULT NULL,
	CONSTRAINT user_pk PRIMARY KEY (id),
	CONSTRAINT user_unique UNIQUE (email)
);

DROP TABLE IF EXISTS public.category;

CREATE TABLE public.category (
	id serial NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT category_pk PRIMARY KEY (id)
);

DROP TABLE IF EXISTS public.subcategory;

CREATE TABLE public.subcategory (
	id serial4 NOT NULL,
	"name" text NOT NULL,
	categoryid int4 NOT NULL,
	CONSTRAINT subcategory_pk PRIMARY KEY (id),
	CONSTRAINT subcategory_category_fk FOREIGN KEY (categoryid) REFERENCES public.category(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS public.file;

CREATE TABLE public.file (
	id serial4 NOT NULL,
	subcategoryid int4 NOT NULL,
	"name" text NULL,
	uploaderid text NOT NULL,
	isreported bool DEFAULT FALSE NOT NULL,
	CONSTRAINT file_pk PRIMARY KEY (id),
	CONSTRAINT file_subcategory_fk FOREIGN KEY (subcategoryid) REFERENCES public.subcategory(id) ON DELETE CASCADE,
	CONSTRAINT file_user_fk FOREIGN KEY (uploaderid) REFERENCES public."User"(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS public.exam;

CREATE TABLE public.exam (
	id serial4 NOT NULL,
	subcategoryid int4 NOT NULL,
	"name" text NULL,
	creatorid text NOT NULL,
	CONSTRAINT exam_pk PRIMARY KEY (id),
	CONSTRAINT exam_subcategory_fk FOREIGN KEY (subcategoryid) REFERENCES public.subcategory(id) ON DELETE CASCADE,
	CONSTRAINT exam_user_fk FOREIGN KEY (creatorid) REFERENCES public."User"(id) ON DELETE CASCADE
);

CREATE TYPE public.question_type AS ENUM ('MC_QUESTION', 'TRUE_FALSE_QUESTION');

CREATE TABLE public.question (
  id serial4 NOT NULL,
  examid int4 NOT NULL,
  question text NOT NULL,
  questiontype public.question_type NOT NULL,
  istrue bool NULL,
  correctanswers text[] NULL,
  wronganswers text[] NULL,
  CONSTRAINT question_pk PRIMARY KEY (id),
  CONSTRAINT question_exam_fk FOREIGN KEY (examid) REFERENCES public.exam(id) ON DELETE CASCADE
);

CREATE TABLE public.favourite (
  userid text NOT NULL,
  fileid int4 NOT NULL,
  CONSTRAINT favourite_pk PRIMARY KEY (userid, fileid),
  CONSTRAINT favourite_user_fk FOREIGN KEY (userid) REFERENCES public."User"(id) ON DELETE CASCADE,
  CONSTRAINT favourite_file_fk FOREIGN KEY (fileid) REFERENCES public.file(id) ON DELETE CASCADE
);

CREATE TYPE public.rating_value AS ENUM ('BAD', 'MEDIUM', 'GOOD');

CREATE TABLE public.rating (
  id serial4 NOT NULL,
  userid text NOT NULL,
  fileid int4 NOT NULL,
  rating public.rating_value NOT NULL,
  CONSTRAINT rating_pk PRIMARY KEY (id),
  CONSTRAINT rating_user_fk FOREIGN KEY (userid) REFERENCES public."User"(id) ON DELETE CASCADE,
  CONSTRAINT rating_file_fk FOREIGN KEY (fileid) REFERENCES public.file(id) ON DELETE CASCADE,
  CONSTRAINT rating_unique_user_file UNIQUE (userid, fileid)
);