Create sequence user_id_sequence
  start 10000000
  increment 1;

CREATE sequence coin_id_sequence
  start 1000000
  increment 1;

CREATE SEQUENCE ios_device_id_sequence
  start 100000000
  increment 1;

CREATE SEQUENCE interest_id_sequence
  start 100000000
  increment 1;

create table users
(
  user_id    integer default nextval('user_id_sequence' :: regclass) not null,
  first_name varchar(40)                                             not null,
  last_name  varchar(40)                                             not null,
  email      varchar(80)                                             not null,
  password   varchar(100)                                            not null,
  salt       varchar(20)                                             not null,
  title      varchar(4),
  interest   boolean default true                                    not null,
  flash      boolean default true,
  news       boolean default true                                    not null,
  language   varchar(5) default 'EN' :: character varying            not null
);

create unique index users_user_id_uindex
  on users (user_id);

create unique index users_email_uindex
  on users (email);


create table coins
(
  coin_id integer default nextval('coin_id_sequence' :: regclass) not null
    constraint coins_pkey
    primary key,
  "from"  varchar(20)                                             not null,
  "to"    varchar(20)                                             not null,
  market  varchar(40)                                             not null,
  price   double precision
);



create table iosdevices
(
  device_id      integer default nextval('ios_device_id_sequence' :: regclass) not null
    constraint iosdevices_pkey
    primary key,
  device_user_id integer                                                       not null
    constraint iosdevices_user_id
    references users (user_id),
  device_token   varchar(80)                                                   not null,
  number         integer default 0                                             not null
);

create unique index iosdevices_device_token_uindex
  on iosdevices (device_token);


create table interests
(
  interest_user_id integer                                                     not null
    constraint interests_user_id
    references users (user_id),
  interest_id      integer default nextval('interest_id_sequence' :: regclass) not null
    constraint interests_pkey
    primary key,
  interest_coin_id integer                                                     not null
    constraint interests_coin_id
    references coins,
  price            double precision                                            not null,
  status           boolean default true                                        not null,
  next             timestamp,
  frequence        integer default 1                                           not null,
  isgreater        integer                                                     not null
);

create unique index interests_interest_id_uindex
  on interests (interest_id);










CREATE TABLE public.users
(
    user_id int DEFAULT nextval('user_id_sequence'::regclass) NOT NULL,
    first_name varchar(40) NOT NULL,
    last_name varchar(40) NOT NULL,
    email varchar(80) NOT NULL,
    password varchar(100) NOT NULL,
    salt varchar(20) NOT NULL,
    title varchar(4),
    interest boolean DEFAULT true  NOT NULL,
    flash boolean DEFAULT true ,
    news boolean DEFAULT true  NOT NULL,
    language varchar(5) DEFAULT 'EN' NOT NULL
);
CREATE UNIQUE INDEX users_user_id_uindex ON public.users (user_id);
CREATE UNIQUE INDEX users_email_uindex ON public.users (email);

insert into coins ("from", "to", market) values ('BTC','AUD','marketcap') returning *;

insert into interests (interest_user_id, interest_coin_id, price) values ((SELECT user_id from users where email = 'test123@test.com'),10000,270) returning *;


update interests set
  status = c.status
from (values
  (1000000027,true)
) as c(id,status)
where c.id = interests.interest_id returning *;

update users set interest='false' where email='test123@test.com' returning interest;


delete from interests
where interest_id in (
  1000000005
) returning *;


select distinct users.user_id,coins."from",coins."to",interests.price as inPirce,coins.price as coPrice,
  interests.isgreater,coins.market,interests.status, iosdevices.device_token,iosdevices.number
from (((interests join coins on interests.interest_coin_id = coins.coin_id)
join users on interests.interest_user_id = users.user_id)
join iosdevices on users.user_id = iosdevices.device_user_id)
 where status = true and users.interest=true;

insert into iosdevices (device_user_id, device_token) VALUES ((SELECT user_id from users where email='test123@test.com'),'this is device token here1231231') returning *;

select coins."from",coins."to",coins.market,interests.interest_id,interests.price,interests.isgreater,interests.frequence
from (interests join coins on interests.interest_coin_id = coins.coin_id)
where interest_id=1000000009;

Update interests set (price,isgreater) = (200,1) where interest_id = 1000000008 returning *;

update iosdevices set number = number+1 where device_token='this is device token here' returning device_token,number;

update iosdevices set number = 0 where device_token = 'this is device token here' returning device_token,number;

Update coins set price=10 where coin_id=10000 returning *;

SELECT * FROM coins;

SELECT iosdevices.device_token
from (users join iosdevices on users.user_id=iosdevices.device_user_id)
where users.flash = true;



UPDATE coins SET available=false WHERE "from"='BTC';









Create sequence user_id_sequence
  start 10000000
  increment 1;

CREATE sequence coin_id_sequence
  start 1000000
  increment 1;

CREATE SEQUENCE ios_device_id_sequence
  start 100000000
  increment 1;

CREATE SEQUENCE interest_id_sequence
  start 100000000
  increment 1;

create table users
(
  user_id    integer default nextval('user_id_sequence' :: regclass) not null,
  first_name varchar(40)                                             not null,
  last_name  varchar(40)                                             not null,
  email      varchar(80)                                             not null,
  password   varchar(100)                                            not null,
  salt       varchar(20)                                             not null,
  title      varchar(4),
  interest   boolean default true                                    not null,
  flash      boolean default true,
  news       boolean default true                                    not null,
  language   varchar(5) default 'EN' :: character varying            not null
);

create unique index users_user_id_uindex
  on users (user_id);

create unique index users_email_uindex
  on users (email);


create table coins
(
  coin_id integer default nextval('coin_id_sequence' :: regclass) not null
    constraint coins_pkey
    primary key,
  "from"  varchar(20)                                             not null,
  "to"    varchar(20)                                             not null,
  market  varchar(40)                                             not null,
  price   double precision
);



create table iosdevices
(
  device_id      integer default nextval('ios_device_id_sequence' :: regclass) not null
    constraint iosdevices_pkey
    primary key,
  device_user_id integer                                                       not null
    constraint iosdevices_user_id
    references users (user_id),
  device_token   varchar(80)                                                   not null,
  number         integer default 0                                             not null
);

create unique index iosdevices_device_token_uindex
  on iosdevices (device_token);


create table interests
(
  interest_user_id integer                                                     not null
    constraint interests_user_id
    references users (user_id),
  interest_id      integer default nextval('interest_id_sequence' :: regclass) not null
    constraint interests_pkey
    primary key,
  interest_coin_id integer                                                     not null
    constraint interests_coin_id
    references coins,
  price            double precision                                            not null,
  status           boolean default true                                        not null,
  next             timestamp,
  frequence        integer default 1                                           not null,
  isgreater        integer                                                     not null
);

create unique index interests_interest_id_uindex
  on interests (interest_id);
