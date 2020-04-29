create sequence if not exists hibernate_sequence start with 1 increment by 1;

create table if not exists supervisor (
    create_date timestamp,
    username varchar(255) not null,
    password_hash varchar(255) not null,
    version integer not null,
    primary key (username)
    );

create table if not exists learner_user (
    version integer not null,
    active boolean default true,
    name varchar(255),
    username varchar(255) not null,
    supervisor varchar(255) not null,
    primary key (username),
    constraint FK_learner_supervisor foreign key (supervisor) references supervisor
    );

create table if not exists phrase (
    id bigint not null,
    version integer not null,
    content varchar(255) not null,
    content_hash varchar(255) not null,
    difficulty integer default 0,
    created_date timestamp,
    modified_date timestamp,
    primary key (id),
    constraint UK_contentHash unique (content_hash)
    );

create table if not exists score (
    character varchar(255) not null,
    learner varchar(255) not null,
    correct integer default 0,
    incorrect integer default 0,
    first_seen timestamp,
    last_seen timestamp,
    version integer not null,
    primary key (character, learner),
    constraint FK_learner foreign key (learner) references learner_user
    );

create table if not exists phrase_familiarity (
    learner varchar(255) not null,
    phrase bigint not null,familiarity integer default 0,
    create_date timestamp,
    last_modified_date timestamp,
    primary key (learner, phrase),
    constraint FK_supervisor foreign key (learner) references learner_user,
    constraint FK_phrase foreign key (phrase) references phrase
    );



