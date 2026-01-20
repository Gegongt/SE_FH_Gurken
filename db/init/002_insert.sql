INSERT INTO public."User"
(id, isadmin, email, "name", isblocked, profilepicturename)
VALUES('VOh6Pk75LoQjyETgTWWl8aR52r83', true, 'filip.lukic@stud.hcw.ac.at', 'filip.lukic', false, NULL);
INSERT INTO public."User"
(id, isadmin, email, "name", isblocked, profilepicturename)
VALUES('WcMTIWP4jfXw6ZdCuYpabtUWqY92', true, 'sebastian.pfeiffer@stud.hcw.ac.at', 'sebastian.pfeiffer', false, NULL);
INSERT INTO public."User"
(id, isadmin, email, "name", isblocked, profilepicturename)
VALUES('JBJsSyUsuvgY5IcpQiSnn38rgx42', true, 'florian.gebauer@stud.hcw.ac.at', 'florian.gebauer', false, NULL);
INSERT INTO public."User"
(id, isadmin, email, "name", isblocked, profilepicturename)
VALUES('QZTDJjp92WZkyuqqYenDG01JsQ02', false, 'max.muster@stud.hcw.ac.at', 'Maxl', false, NULL);
INSERT INTO public."User"
(id, isadmin, email, "name", isblocked, profilepicturename)
VALUES('Vzwf7ton6rNZ2FziqyPTkp4YyGa2', false, 'erika.muster@stud.hcw.ac.at', 'Erika', false, NULL);

INSERT INTO public.category (id, "name") VALUES(1, 'Computer Science');
INSERT INTO public.category (id, "name") VALUES(2, 'Bioengineering');
INSERT INTO public.category (id, "name") VALUES(3, 'General');

INSERT INTO public.subcategory (id, "name", categoryid) VALUES(1, 'Betriebssysteme', 1);
INSERT INTO public.subcategory (id, "name", categoryid) VALUES(2, 'Digital Communications', 1);
INSERT INTO public.subcategory (id, "name", categoryid) VALUES(3, 'Konzepte der IT', 1);
INSERT INTO public.subcategory (id, "name", categoryid) VALUES(4, 'Mathematik 1', 1);
INSERT INTO public.subcategory (id, "name", categoryid) VALUES(5, 'Programmierung 1', 1);
INSERT INTO public.subcategory (id, "name", categoryid) VALUES(6, 'Teamarbeit', 1);
INSERT INTO public.subcategory (id, "name", categoryid) VALUES(7, 'Datenbanken', 1);
INSERT INTO public.subcategory (id, "name", categoryid) VALUES(8, 'Mathematik 2', 1);
INSERT INTO public.subcategory (id, "name", categoryid) VALUES(9, 'Network Applications', 1);
INSERT INTO public.subcategory (id, "name", categoryid) VALUES(10, 'Professional Presentations', 1);
INSERT INTO public.subcategory (id, "name", categoryid) VALUES(11, 'Programmierung 2', 1);
INSERT INTO public.subcategory (id, "name", categoryid) VALUES(12, 'Web Technologies', 1);
INSERT INTO public.subcategory (id, "name", categoryid) VALUES(13, 'DevOps', 1);
INSERT INTO public.subcategory (id, "name", categoryid) VALUES(14, 'Internet of Things', 1);
INSERT INTO public.subcategory (id, "name", categoryid) VALUES(15, 'Introduction to AI and Data Science', 1);
INSERT INTO public.subcategory (id, "name", categoryid) VALUES(16, 'IT Security Fundamentals', 1);
INSERT INTO public.subcategory (id, "name", categoryid) VALUES(17, 'Research Methods', 1);
INSERT INTO public.subcategory (id, "name", categoryid) VALUES(18, 'Software Engineering', 1);

INSERT INTO public.subcategory (id, "name", categoryid) VALUES(19, 'Mathematik', 2);
INSERT INTO public.subcategory (id, "name", categoryid) VALUES(20, 'Allgemeine Mikrobiologie', 2);
INSERT INTO public.subcategory (id, "name", categoryid) VALUES(21, 'Physik', 2);

INSERT INTO public.subcategory (id, "name", categoryid) VALUES(22, 'Secretariat', 3);
INSERT INTO public.subcategory (id, "name", categoryid) VALUES(23, 'Parking', 3);

SELECT * FROM public."User";