CREATE TABLE "users" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL,
	"email" TEXT NOT NULL UNIQUE,
	"password" TEXT NOT NULL,
	"plan_id" integer,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "sessions" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"token" TEXT NOT NULL,
	CONSTRAINT "sessions_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "plans" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL UNIQUE,
	CONSTRAINT "plans_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "products" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL UNIQUE,
	CONSTRAINT "products_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "signatures" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"plan_id" integer NOT NULL,
	"delivery_id" integer NOT NULL,
	"signature_date" DATE NOT NULL DEFAULT 'now()',
	CONSTRAINT "signatures_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "delivery_infos" (
	"id" serial NOT NULL,
	"cep" TEXT NOT NULL,
	"number" integer NOT NULL,
	"date_id" integer NOT NULL,
	"full_name" TEXT NOT NULL,
	CONSTRAINT "delivery_infos_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "dates" (
	"id" serial NOT NULL,
	"date" TEXT NOT NULL,
	CONSTRAINT "dates_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "users_products" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	CONSTRAINT "users_products_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



ALTER TABLE "users" ADD CONSTRAINT "users_fk0" FOREIGN KEY ("plan_id") REFERENCES "plans"("id");

ALTER TABLE "sessions" ADD CONSTRAINT "sessions_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");



ALTER TABLE "signatures" ADD CONSTRAINT "signatures_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "signatures" ADD CONSTRAINT "signatures_fk1" FOREIGN KEY ("plan_id") REFERENCES "plans"("id");
ALTER TABLE "signatures" ADD CONSTRAINT "signatures_fk2" FOREIGN KEY ("delivery_id") REFERENCES "delivery_infos"("id");

ALTER TABLE "delivery_infos" ADD CONSTRAINT "delivery_infos_fk0" FOREIGN KEY ("date_id") REFERENCES "dates"("id");


ALTER TABLE "users_products" ADD CONSTRAINT "users_products_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "users_products" ADD CONSTRAINT "users_products_fk1" FOREIGN KEY ("product_id") REFERENCES "products"("id");

INSERT INTO products (name) VALUES ('Chás');
INSERT INTO products (name) VALUES ('Incensos');
INSERT INTO products (name) VALUES ('Produtos orgânicos');

INSERT INTO plans (name) VALUES ('Semanal');
INSERT INTO plans (name) VALUES ('Mensal');

INSERT INTO dates (date) VALUES ('monday');
INSERT INTO dates (date) VALUES ('wednesday');
INSERT INTO dates (date) VALUES ('friday');
INSERT INTO dates (date) VALUES ('day 01');
INSERT INTO dates (date) VALUES ('day 10');
INSERT INTO dates (date) VALUES ('day 20');
