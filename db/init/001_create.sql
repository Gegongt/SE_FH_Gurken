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