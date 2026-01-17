INSERT INTO public."User"
(id, isadmin, email, "name", isblocked, profilepicturename)
VALUES('1WEAjHYMHOYeMegeMKZlhMwMgEm2', true, 'filiplukic9@gmail.com', 'lelek', false, 's');
INSERT INTO public."User"
(id, isadmin, email, "name", isblocked, profilepicturename)
VALUES('J4mRmXDUUkafdbPARjPioJE7SMC2', false, 'filiplukic8@gmail.com', 'lelek', false, 's');
INSERT INTO public."User"
(id, isadmin, email, "name", isblocked, profilepicturename)
VALUES('spf9ePCYKUY4tzBKaRRS9c2GXc32', false, 'filiplukic7@gmail.com', 'Filip Luic', false, 'i');
INSERT INTO public."User"
(id, isadmin, email, "name", isblocked, profilepicturename)
VALUES('l7LJVSzdWEg22hjIqIw2ALowfUx1', false, 'filiplukic4@gmail.com', 'Filip Luic', true, 'i');
INSERT INTO public."User"
(id, isadmin, email, "name", isblocked, profilepicturename)
VALUES('y7bvvsDHYER9wPvRmA4nMIkNMVU2', false, 'filiplukic6@gmail.com', 'lelek', false, 's');

INSERT INTO public.category
(id, "name")
VALUES(1, 'Test');
INSERT INTO public.category
(id, "name")
VALUES(2, 'Pizza');
INSERT INTO public.category
(id, "name")
VALUES(3, 'Burger');

INSERT INTO public.subcategory
(id, "name", categoryid)
VALUES(2, 'Magnet', 1);
INSERT INTO public.subcategory
(id, "name", categoryid)
VALUES(3, 'Sodium', 2);
INSERT INTO public.subcategory
(id, "name", categoryid)
VALUES(4, 'Oppenheimer', 3);
INSERT INTO public.subcategory
(id, "name", categoryid)
VALUES(5, 'Barbie', 3);
INSERT INTO public.subcategory
(id, "name", categoryid)
VALUES(6, 'Ken', 3);
INSERT INTO public.subcategory
(id, "name", categoryid)
VALUES(1, 'Magnet', 1);
