import {sqliteTable,text,integer} from 'drizzle-orm/sqlite-core';
export const records=sqliteTable('records',{id:text('id').primaryKey(),kind:text('kind').notNull(),payload:text('payload').notNull(),revision:integer('revision').notNull().default(1),updatedAt:text('updated_at').notNull()});
export const settings=sqliteTable('settings',{id:text('id').primaryKey(),payload:text('payload').notNull(),revision:integer('revision').notNull().default(1)});
export const activity=sqliteTable('activity',{id:text('id').primaryKey(),recordId:text('record_id').notNull(),title:text('title').notNull(),action:text('action').notNull(),actor:text('actor').notNull(),createdAt:text('created_at').notNull()});
