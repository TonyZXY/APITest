insert into ios_newsflash_devices (device_token) values ('qwertyuiop1234567890');



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



create sequence transaction_id_sequence
  start 100000000
  increment 1;


CREATE TABLE transactions
(
  transaction_id      int DEFAULT nextval('transaction_id_sequence' :: regclass) PRIMARY KEY NOT NULL,
  transaction_user_id int                                                                    NOT NULL,
  status              varchar(10)                                                            not null,
  coin_name           varchar(100)                                                           not null,
  coin_add_name       varchar(40)                                                            not null,
  exchange_name       varchar(50)                                                            not null,
  trading_pair_name   varchar(40)                                                            not null,
  single_price        float                                                                  not null,
  amount              float                                                                  not null,
  currency_aud        float                                                                  not null,
  currency_usd        float                                                                  not null,
  currency_jpy        float                                                                  not null,
  currency_eur        float                                                                  not null,
  currency_cny        float                                                                  not null,
  date                timestamp with time zone                                               not null,
  note                varchar(500),
  CONSTRAINT transactions_users_user_id_fk FOREIGN KEY (transaction_user_id) REFERENCES users (user_id)
);


create sequence ios_newsflash_devices
  start 100000000
  increment 1;


CREATE TABLE ios_newsflash
(
  device_id int DEFAULT nextval('ios_device_id_sequence' :: regclass) PRIMARY KEY NOT NULL,
  device_token varchar(100) NOT NULL,
  number int DEFAULT 0 NOT NULL
);
CREATE UNIQUE INDEX ios_newsflash_device_token_uindex ON public.ios_newsflash (device_token);




create table like_dislike
(
  news_id  varchar(80) not null
    constraint like_dislike_pkey
    primary key,
  likes    integer default 0,
  dislikes integer default 0
);


create unique index like_dislike_news_id_uindex
  on like_dislike (news_id);



CREATE sequence game_account_id
  start 1000000
  increment 1;


-- Tables for trading game start here


CREATE TABLE public.game_account
(
  user_id int PRIMARY KEY NOT NULL,
  aud double precision DEFAULT 10000,
  btc double precision DEFAULT 0,
  eth double precision DEFAULT 0,
  bch double precision DEFAULT 0,
  ltc double precision DEFAULT 0,
  powr double precision DEFAULT 0,
  elf double precision DEFAULT 0,
  ctxc double precision DEFAULT 0,
  dta double precision DEFAULT 0,
  iost double precision DEFAULT 0,
  last_week double precision,
  this_week double precision,
  total double precision,
  reset boolean DEFAULT false ,
  CONSTRAINT game_account_users_user_id_fk FOREIGN KEY (user_id) REFERENCES public.users (user_id)
);
CREATE UNIQUE INDEX game_account_user_id_uindex ON public.game_account (user_id);


create sequence game_transaction_id
  start 2000000000
  increment 1;



CREATE TABLE public.game_transactions
(
  transaction_id int DEFAULT nextval('game_transaction_id'::regclass) PRIMARY KEY,
  user_id int NOT NULL,
  status varchar(10) NOT NULL,
  coin_name varchar(100) NOT NULL,
  coin_add_name varchar(40) NOT NULL,
  exchange_name varchar(50) NOT NULL,
  trading_pair_name varchar(40) NOT NULL,
  single_price double precision NOT NULL,
  amount double precision NOT NULL,
  date timestamp with time zone NOT NULL,
  note varchar(500),
  auto boolean NOT NULL,
  CONSTRAINT game_transactions_users_user_id_fk FOREIGN KEY (user_id) REFERENCES public.users (user_id)
);

create sequence game_auto_id
  start 20000000000
  increment 1;

CREATE TABLE public.game_stop_loss_sets
(
  set_id int DEFAULT nextval('game_auto_id'::regclass) PRIMARY KEY,
  user_id int NOT NULL,
  coin_name varchar(10) NOT NULL,
  price_greater double precision,
  price_lower double precision,
  amount double precision NOT NULL,
  actived boolean DEFAULT true NOT NULL,
  CONSTRAINT game_stop_loss_sets_users_user_id_fk FOREIGN KEY (user_id) REFERENCES public.users (user_id)
);
CREATE UNIQUE INDEX game_stop_loss_sets_set_id_uindex ON public.game_stop_loss_sets (set_id);


create sequence game_alert_id
  start 2000000000
  increment 1;

CREATE TABLE public.game_alert
(
  alert_id int DEFAULT nextval('game_alert_id'::regclass) PRIMARY KEY NOT NULL,
  user_id int NOT NULL,
  coin_name varchar(10) NOT NULL,
  price double precision NOT NULL,
  status boolean DEFAULT true NOT NULL,
  isgreater int NOT NULL,
  CONSTRAINT gane_alert_users_user_id_fk FOREIGN KEY (user_id) REFERENCES public.users (user_id)
);
CREATE UNIQUE INDEX gane_alert_alert_id_uindex ON public.game_alert (alert_id);




