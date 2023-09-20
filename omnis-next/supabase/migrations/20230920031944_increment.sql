alter table "public"."todos" add column "index" int not null generated by default as identity;
alter table "public"."todos" add column "scheduled_date" date;

create function increment (starting_index int, move_index int) 
returns void as
$$
  update todos 
  set index = index + 1
  where index >= starting_index AND index < move_index
$$ 
language sql volatile;


create function decrement (starting_index int, move_index int) 
returns void as
$$
  update todos 
  set index = index - 1
  where index <= starting_index AND index > move_index
$$ 
language sql volatile;

create function max_index (scheduled_date date) returns int as
$$
  select max(index) from todos
$$
language sql volatile;
