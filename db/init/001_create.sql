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