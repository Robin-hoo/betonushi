--
-- PostgreSQL database dump
--

-- Dumped from database version 17.7 (bdc8956)
-- Dumped by pg_dump version 17rc1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: trigger_update_food_rating(); Type: FUNCTION; Schema: public; Owner: neondb_owner
--

CREATE FUNCTION public.trigger_update_food_rating() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Only update rating for food reviews
    IF NEW.type = 'food' THEN
        PERFORM update_food_rating(NEW.target_id);
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.trigger_update_food_rating() OWNER TO neondb_owner;

--
-- Name: trigger_update_food_rating_delete(); Type: FUNCTION; Schema: public; Owner: neondb_owner
--

CREATE FUNCTION public.trigger_update_food_rating_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Only update rating for food reviews
    IF OLD.type = 'food' THEN
        PERFORM update_food_rating(OLD.target_id);
    END IF;
    RETURN OLD;
END;
$$;


ALTER FUNCTION public.trigger_update_food_rating_delete() OWNER TO neondb_owner;

--
-- Name: update_food_rating(integer); Type: FUNCTION; Schema: public; Owner: neondb_owner
--

CREATE FUNCTION public.update_food_rating(foodid integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE foods
    SET 
        number_of_rating = (
            SELECT COUNT(*) 
            FROM reviews 
            WHERE target_id = foodId AND type = 'food'
        ),
        rating = (
            SELECT COALESCE(ROUND(AVG(rating)::numeric, 2), 0) 
            FROM reviews 
            WHERE target_id = foodId AND type = 'food'
        )
    WHERE food_id = foodId;
END;
$$;


ALTER FUNCTION public.update_food_rating(foodid integer) OWNER TO neondb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: conversation_phrases; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.conversation_phrases (
    phrase_id integer NOT NULL,
    category character varying(255),
    content text
);


ALTER TABLE public.conversation_phrases OWNER TO neondb_owner;

--
-- Name: TABLE conversation_phrases; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON TABLE public.conversation_phrases IS 'Japanese conversation phrases for food-related situations';


--
-- Name: conversation_phrases_phrase_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.conversation_phrases_phrase_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.conversation_phrases_phrase_id_seq OWNER TO neondb_owner;

--
-- Name: conversation_phrases_phrase_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.conversation_phrases_phrase_id_seq OWNED BY public.conversation_phrases.phrase_id;


--
-- Name: favorites; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.favorites (
    favorite_id integer NOT NULL,
    user_id integer NOT NULL,
    target_id integer NOT NULL,
    type character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT favorites_type_check CHECK (((type)::text = ANY ((ARRAY['food'::character varying, 'restaurant'::character varying])::text[])))
);


ALTER TABLE public.favorites OWNER TO neondb_owner;

--
-- Name: TABLE favorites; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON TABLE public.favorites IS 'User favorites for foods and restaurants';


--
-- Name: favorites_favorite_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.favorites_favorite_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.favorites_favorite_id_seq OWNER TO neondb_owner;

--
-- Name: favorites_favorite_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.favorites_favorite_id_seq OWNED BY public.favorites.favorite_id;


--
-- Name: flavors; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.flavors (
    flavor_id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.flavors OWNER TO neondb_owner;

--
-- Name: TABLE flavors; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON TABLE public.flavors IS 'Flavor profiles (sweet, sour, spicy, etc.)';


--
-- Name: flavors_flavor_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.flavors_flavor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.flavors_flavor_id_seq OWNER TO neondb_owner;

--
-- Name: flavors_flavor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.flavors_flavor_id_seq OWNED BY public.flavors.flavor_id;


--
-- Name: food; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.food (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    story text,
    ingredient text,
    taste text,
    style text,
    comparison text,
    rating double precision DEFAULT 0,
    number_of_rating integer DEFAULT 0
);


ALTER TABLE public.food OWNER TO neondb_owner;

--
-- Name: food_flavors; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.food_flavors (
    food_id integer NOT NULL,
    flavor_id integer NOT NULL,
    intensity_level integer,
    CONSTRAINT food_flavors_intensity_level_check CHECK (((intensity_level >= 1) AND (intensity_level <= 5)))
);


ALTER TABLE public.food_flavors OWNER TO neondb_owner;

--
-- Name: TABLE food_flavors; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON TABLE public.food_flavors IS 'Many-to-many relationship between foods and flavors';


--
-- Name: food_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.food_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.food_id_seq OWNER TO neondb_owner;

--
-- Name: food_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.food_id_seq OWNED BY public.food.id;


--
-- Name: food_image; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.food_image (
    id integer NOT NULL,
    path text NOT NULL,
    food_id integer NOT NULL
);


ALTER TABLE public.food_image OWNER TO neondb_owner;

--
-- Name: food_image_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.food_image_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.food_image_id_seq OWNER TO neondb_owner;

--
-- Name: food_image_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.food_image_id_seq OWNED BY public.food_image.id;


--
-- Name: food_images; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.food_images (
    food_image_id integer NOT NULL,
    food_id integer NOT NULL,
    image_url text NOT NULL,
    display_order integer DEFAULT 0,
    is_primary boolean DEFAULT false
);


ALTER TABLE public.food_images OWNER TO neondb_owner;

--
-- Name: TABLE food_images; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON TABLE public.food_images IS 'Multiple images for each food item';


--
-- Name: food_images_food_image_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.food_images_food_image_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.food_images_food_image_id_seq OWNER TO neondb_owner;

--
-- Name: food_images_food_image_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.food_images_food_image_id_seq OWNED BY public.food_images.food_image_id;


--
-- Name: food_ingredients; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.food_ingredients (
    food_id integer NOT NULL,
    ingredient_id integer NOT NULL
);


ALTER TABLE public.food_ingredients OWNER TO neondb_owner;

--
-- Name: TABLE food_ingredients; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON TABLE public.food_ingredients IS 'Many-to-many relationship between foods and ingredients';


--
-- Name: food_translations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.food_translations (
    translation_id integer NOT NULL,
    food_id integer NOT NULL,
    lang character varying(5) NOT NULL,
    name character varying(255),
    story text,
    ingredient text,
    taste text,
    style text,
    comparison text
);


ALTER TABLE public.food_translations OWNER TO neondb_owner;

--
-- Name: food_translations_translation_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.food_translations_translation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.food_translations_translation_id_seq OWNER TO neondb_owner;

--
-- Name: food_translations_translation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.food_translations_translation_id_seq OWNED BY public.food_translations.translation_id;


--
-- Name: foods; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.foods (
    food_id integer NOT NULL,
    name character varying(255) NOT NULL,
    story text,
    ingredient text,
    taste text,
    style text,
    comparison text,
    region_id integer,
    view_count integer DEFAULT 0,
    rating numeric(3,2) DEFAULT 0,
    number_of_rating integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.foods OWNER TO neondb_owner;

--
-- Name: TABLE foods; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON TABLE public.foods IS 'Vietnamese foods';


--
-- Name: foods_food_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.foods_food_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.foods_food_id_seq OWNER TO neondb_owner;

--
-- Name: foods_food_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.foods_food_id_seq OWNED BY public.foods.food_id;


--
-- Name: i18n; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.i18n (
    id integer NOT NULL,
    key character varying(255) NOT NULL,
    lang character varying(10) NOT NULL,
    value text
);


ALTER TABLE public.i18n OWNER TO neondb_owner;

--
-- Name: TABLE i18n; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON TABLE public.i18n IS 'Internationalization translations';


--
-- Name: i18n_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.i18n_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.i18n_id_seq OWNER TO neondb_owner;

--
-- Name: i18n_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.i18n_id_seq OWNED BY public.i18n.id;


--
-- Name: ingredients; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.ingredients (
    ingredient_id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.ingredients OWNER TO neondb_owner;

--
-- Name: TABLE ingredients; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON TABLE public.ingredients IS 'Food ingredients';


--
-- Name: ingredients_ingredient_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.ingredients_ingredient_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ingredients_ingredient_id_seq OWNER TO neondb_owner;

--
-- Name: ingredients_ingredient_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.ingredients_ingredient_id_seq OWNED BY public.ingredients.ingredient_id;


--
-- Name: regions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.regions (
    region_id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.regions OWNER TO neondb_owner;

--
-- Name: TABLE regions; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON TABLE public.regions IS 'Vietnamese geographical regions';


--
-- Name: regions_region_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.regions_region_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.regions_region_id_seq OWNER TO neondb_owner;

--
-- Name: regions_region_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.regions_region_id_seq OWNED BY public.regions.region_id;


--
-- Name: restaurant_facilities; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.restaurant_facilities (
    restaurant_id integer NOT NULL,
    facility_name character varying(255) NOT NULL
);


ALTER TABLE public.restaurant_facilities OWNER TO neondb_owner;

--
-- Name: TABLE restaurant_facilities; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON TABLE public.restaurant_facilities IS 'Restaurant amenities (parking, card payment, etc.)';


--
-- Name: restaurant_foods; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.restaurant_foods (
    restaurant_id integer NOT NULL,
    food_id integer NOT NULL,
    price numeric(10,2),
    is_recommended boolean DEFAULT false
);


ALTER TABLE public.restaurant_foods OWNER TO neondb_owner;

--
-- Name: TABLE restaurant_foods; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON TABLE public.restaurant_foods IS 'Foods available at each restaurant';


--
-- Name: restaurant_translations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.restaurant_translations (
    translation_id integer NOT NULL,
    restaurant_id integer NOT NULL,
    lang character varying(5) NOT NULL,
    name character varying(255),
    address text
);


ALTER TABLE public.restaurant_translations OWNER TO neondb_owner;

--
-- Name: restaurant_translations_translation_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.restaurant_translations_translation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.restaurant_translations_translation_id_seq OWNER TO neondb_owner;

--
-- Name: restaurant_translations_translation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.restaurant_translations_translation_id_seq OWNED BY public.restaurant_translations.translation_id;


--
-- Name: restaurants; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.restaurants (
    restaurant_id integer NOT NULL,
    name character varying(255) NOT NULL,
    address character varying(255),
    latitude numeric(10,8),
    longitude numeric(11,8),
    open_time time without time zone,
    close_time time without time zone,
    price_range character varying(50),
    phone_number character varying(20)
);


ALTER TABLE public.restaurants OWNER TO neondb_owner;

--
-- Name: TABLE restaurants; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON TABLE public.restaurants IS 'Restaurant locations and information';


--
-- Name: restaurants_restaurant_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.restaurants_restaurant_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.restaurants_restaurant_id_seq OWNER TO neondb_owner;

--
-- Name: restaurants_restaurant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.restaurants_restaurant_id_seq OWNED BY public.restaurants.restaurant_id;


--
-- Name: review; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.review (
    id integer NOT NULL,
    user_id integer NOT NULL,
    comment text,
    rating double precision NOT NULL,
    food_id integer NOT NULL,
    CONSTRAINT review_rating_check CHECK (((rating >= (0)::double precision) AND (rating <= (5)::double precision)))
);


ALTER TABLE public.review OWNER TO neondb_owner;

--
-- Name: review_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.review_id_seq OWNER TO neondb_owner;

--
-- Name: review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.review_id_seq OWNED BY public.review.id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.reviews (
    review_id integer NOT NULL,
    user_id integer NOT NULL,
    target_id integer NOT NULL,
    type character varying(20) NOT NULL,
    rating integer,
    comment text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5))),
    CONSTRAINT reviews_type_check CHECK (((type)::text = ANY ((ARRAY['food'::character varying, 'restaurant'::character varying])::text[])))
);


ALTER TABLE public.reviews OWNER TO neondb_owner;

--
-- Name: TABLE reviews; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON TABLE public.reviews IS 'User reviews for foods and restaurants';


--
-- Name: reviews_review_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.reviews_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_review_id_seq OWNER TO neondb_owner;

--
-- Name: reviews_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.reviews_review_id_seq OWNED BY public.reviews.review_id;


--
-- Name: user_preferences; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.user_preferences (
    preference_id integer NOT NULL,
    user_id integer NOT NULL,
    favorite_taste character varying(255),
    disliked_ingredients character varying(255),
    dietary_criteria character varying(255),
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_preferences OWNER TO neondb_owner;

--
-- Name: TABLE user_preferences; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON TABLE public.user_preferences IS 'User food preferences and dietary restrictions';


--
-- Name: user_preferences_preference_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.user_preferences_preference_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_preferences_preference_id_seq OWNER TO neondb_owner;

--
-- Name: user_preferences_preference_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.user_preferences_preference_id_seq OWNED BY public.user_preferences.preference_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    full_name character varying(255),
    birth_date date,
    avatar_url character varying(255),
    role character varying(50) DEFAULT 'user'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: TABLE users; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON TABLE public.users IS 'User accounts and authentication';


--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO neondb_owner;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: conversation_phrases phrase_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.conversation_phrases ALTER COLUMN phrase_id SET DEFAULT nextval('public.conversation_phrases_phrase_id_seq'::regclass);


--
-- Name: favorites favorite_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.favorites ALTER COLUMN favorite_id SET DEFAULT nextval('public.favorites_favorite_id_seq'::regclass);


--
-- Name: flavors flavor_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.flavors ALTER COLUMN flavor_id SET DEFAULT nextval('public.flavors_flavor_id_seq'::regclass);


--
-- Name: food id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.food ALTER COLUMN id SET DEFAULT nextval('public.food_id_seq'::regclass);


--
-- Name: food_image id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.food_image ALTER COLUMN id SET DEFAULT nextval('public.food_image_id_seq'::regclass);


--
-- Name: food_images food_image_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.food_images ALTER COLUMN food_image_id SET DEFAULT nextval('public.food_images_food_image_id_seq'::regclass);


--
-- Name: food_translations translation_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.food_translations ALTER COLUMN translation_id SET DEFAULT nextval('public.food_translations_translation_id_seq'::regclass);


--
-- Name: foods food_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.foods ALTER COLUMN food_id SET DEFAULT nextval('public.foods_food_id_seq'::regclass);


--
-- Name: i18n id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.i18n ALTER COLUMN id SET DEFAULT nextval('public.i18n_id_seq'::regclass);


--
-- Name: ingredients ingredient_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ingredients ALTER COLUMN ingredient_id SET DEFAULT nextval('public.ingredients_ingredient_id_seq'::regclass);


--
-- Name: regions region_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.regions ALTER COLUMN region_id SET DEFAULT nextval('public.regions_region_id_seq'::regclass);


--
-- Name: restaurant_translations translation_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.restaurant_translations ALTER COLUMN translation_id SET DEFAULT nextval('public.restaurant_translations_translation_id_seq'::regclass);


--
-- Name: restaurants restaurant_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.restaurants ALTER COLUMN restaurant_id SET DEFAULT nextval('public.restaurants_restaurant_id_seq'::regclass);


--
-- Name: review id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.review ALTER COLUMN id SET DEFAULT nextval('public.review_id_seq'::regclass);


--
-- Name: reviews review_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reviews ALTER COLUMN review_id SET DEFAULT nextval('public.reviews_review_id_seq'::regclass);


--
-- Name: user_preferences preference_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_preferences ALTER COLUMN preference_id SET DEFAULT nextval('public.user_preferences_preference_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: conversation_phrases; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.conversation_phrases (phrase_id, category, content) FROM stdin;
1	Ordering	すみません、注文をお願いします。(Sumimasen, chuumon wo onegai shimasu) - Excuse me, I'd like to order.
2	Ordering	これをください。(Kore wo kudasai) - I'll have this, please.
3	Ordering	おすすめは何ですか？(Osusume wa nan desu ka) - What do you recommend?
4	Ordering	メニューを見せてください。(Menyuu wo misete kudasai) - Please show me the menu.
5	Dietary	ベジタリアンメニューはありますか？(Bejitarian menyuu wa arimasu ka) - Do you have vegetarian options?
6	Dietary	辛くないものはありますか？(Karakunai mono wa arimasu ka) - Do you have anything not spicy?
7	Dietary	アレルギーがあります。(Arerugii ga arimasu) - I have allergies.
8	Dining	美味しいです！(Oishii desu) - It's delicious!
9	Dining	ごちそうさまでした。(Gochisousama deshita) - Thank you for the meal.
10	Dining	お水をください。(Omizu wo kudasai) - Water, please.
11	Payment	お会計お願いします。(Okaikei onegai shimasu) - Check, please.
12	Payment	カードで払えますか？(Kaado de haraemasu ka) - Can I pay by card?
13	Payment	別々で払います。(Betsubetsu de haraimasu) - We'll pay separately.
14	Compliments	とても美味しかったです。(Totemo oishikatta desu) - It was very delicious.
15	Compliments	また来ます。(Mata kimasu) - I'll come again.
16	Questions	これは何ですか？(Kore wa nan desu ka) - What is this?
17	Questions	トイレはどこですか？(Toire wa doko desu ka) - Where is the restroom?
18	Questions	WiFiはありますか？(WiFi wa arimasu ka) - Do you have WiFi?
\.


--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.favorites (favorite_id, user_id, target_id, type, created_at) FROM stdin;
1	2	1	food	2024-12-01 10:30:00
2	2	3	food	2024-12-03 11:20:00
3	2	1	restaurant	2024-12-01 10:35:00
4	3	1	food	2024-12-02 12:15:00
5	3	5	food	2024-12-04 13:00:00
6	3	2	restaurant	2024-12-02 16:00:00
7	4	2	food	2024-12-01 15:45:00
8	4	6	food	2024-12-03 18:45:00
9	4	3	restaurant	2024-12-03 11:30:00
10	5	4	food	2024-12-02 19:30:00
11	5	20	food	2024-12-04 20:00:00
12	5	5	restaurant	2024-12-04 21:00:00
\.


--
-- Data for Name: flavors; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.flavors (flavor_id, name) FROM stdin;
1	Sweet
2	Sour
3	Spicy
4	Salty
5	Umami
6	Bitter
7	Herbal
\.


--
-- Data for Name: food; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.food (id, name, story, ingredient, taste, style, comparison, rating, number_of_rating) FROM stdin;
\.


--
-- Data for Name: food_flavors; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.food_flavors (food_id, flavor_id, intensity_level) FROM stdin;
1	4	3
1	5	5
1	7	3
2	1	2
2	2	3
2	4	4
3	1	3
3	2	3
3	4	4
3	5	4
4	1	3
4	4	4
4	5	3
5	2	2
5	7	4
6	4	3
6	5	4
6	7	2
7	3	5
7	4	4
7	5	5
7	7	3
8	4	3
8	5	4
9	4	3
9	5	3
9	7	2
10	4	2
10	5	3
11	4	3
11	5	4
11	7	5
12	1	2
12	4	3
12	5	4
13	4	3
13	5	3
14	4	3
14	5	3
15	1	4
15	4	5
15	5	4
16	1	4
16	4	5
17	4	3
17	5	3
18	4	3
18	5	4
19	4	3
19	7	4
20	1	2
20	3	3
20	4	4
20	5	5
\.


--
-- Data for Name: food_image; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.food_image (id, path, food_id) FROM stdin;
\.


--
-- Data for Name: food_images; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.food_images (food_image_id, food_id, image_url, display_order, is_primary) FROM stdin;
1	1	https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/cach_nau_pho_bo_nam_dinh_0_1d94be153c.png	1	t
2	1	https://www.grandmercurehanoi.com/wp-content/uploads/sites/283/2024/08/ph%E1%BB%9F.jpg	2	f
3	1	https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2024_1_26_638418715174070559_pho-bo-anh-dai-dien.jpg	3	f
4	1	https://media-cdn-v2.laodong.vn/storage/newsportal/2024/10/4/1403601/Pho-1-6.jpg	4	f
5	1	https://monngonmoingay.com/wp-content/uploads/2024/06/pho-tai-lan.jpg	5	f
6	2	https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/banh_mi_man_3051eb6d27.jpg	1	t
7	2	https://dynamic-media-cdn.tripadvisor.com/media/photo-o/19/66/94/c1/banh-mi-362.jpg?w=900&h=-1&s=1	2	f
8	2	https://cdn-i2.congthuong.vn/stores/news_dataimages/2024/032024/16/09/top-1-mon-sandwich-ngon-nhat-the-gioi-goi-ten-banh-my-viet-nam1710498007-182420240316092132.jpg?rt=20240316092204	3	f
9	2	https://mms.img.susercontent.com/vn-11134513-7r98o-lsvb2e8s9ok96b@resize_ss1242x600!@crop_w1242_h600_cT	4	f
10	3	https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2024_1_12_638406880045931692_cach-lam-bun-cha-ha-noi-0.jpg	1	t
11	3	https://img-global.cpcdn.com/recipes/83c17e7c30d6c02d/680x781f0.497515_0.5_1.0q80/bun-ch%E1%BA%A3-n%C6%B0%E1%BB%9Bng-ha-n%E1%BB%99i-recipe-main-photo.jpg	2	f
12	3	https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2023_3_4_638135494683018162_cach-lam-bun-cha-bang-noi-chien-khong-dau-1.jpg	3	f
13	3	https://www.seriouseats.com/thmb/J0g7JWjk9r6CHESo1CIrD1BfGd0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/20231204-SEA-VyTran-BunChaHanoi-19-f623913c6ef34a9185bcd6e5680c545f.jpg	4	f
14	3	data:image/jpeg;base64,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	5	f
15	4	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAgcmh00LA0hV9_AMSmiLZpIp5E76aEl9HDw&s	1	t
16	4	https://emdoi.vn/wp-content/uploads/2025/04/com-tam-ngon-quan-1-0.webp	2	f
17	4	https://sakos.vn/wp-content/uploads/2024/10/bia-4.jpg	3	f
18	4	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaTI1V6B-VFGg5avRdvnXXA0XsQyK1ZEIhXg&s	4	f
19	5	data:image/jpeg;base64,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	1	t
20	5	data:image/jpeg;base64,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	2	f
21	5	https://cdn.netspace.edu.vn/images/2020/04/25/cach-lam-goi-cuon-tom-thit-cuc-ki-hap-dan-245587-800.jpg	3	f
22	5	https://cdn.tgdd.vn/Files/2017/03/22/963738/cach-lam-goi-cuon-tom-thit-thom-ngon-cho-bua-com-gian-don-202203021427281747.jpg	4	f
23	5	https://cdn.tgdd.vn/2021/08/CookRecipe/Avatar/goi-cuon-tom-thit-thumbnail-1.jpg	5	f
24	6	https://cdn.tgdd.vn/2021/08/CookRecipe/Avatar/goi-cuon-tom-thit-thumbnail-1.jpg	1	t
25	6	data:image/jpeg;base64,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	2	f
26	6	https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/3/28/1172922/1.jpg	3	f
27	6	https://cdn.zsoft.solutions/poseidon-web/app/media/uploaded-files/0724-banh-xeo-buffet-poseidon-4.jpg	4	f
28	7	https://cdn.zsoft.solutions/poseidon-web/app/media/uploaded-files/0724-banh-xeo-buffet-poseidon-4.jpg	1	t
29	7	https://satrafoods.com.vn/uploads/Images/mon-ngon-moi-ngay/bun-bo-hue.jpg	2	f
30	7	https://file.hstatic.net/200000764737/article/002_7e91b23ac84a4f02812324ab3213ba9f.jpg	3	f
31	7	https://cdn.tcdulichtphcm.vn/upload/2-2023/images/2023-06-19/1687132881-1665749925-4.jpeg	4	f
32	7	https://dienmaynewsun.com/wp-content/uploads/2021/03/bun-bo-hue.jpg	5	f
33	8	data:image/jpeg;base64,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	1	t
34	8	https://cdn.tgdd.vn/2021/12/CookRecipe/CookTipsNote/cao-lau-la-gi-nguon-goc-cao-lau-cao-lau-va-mi-quang-khac-nhau-tipsnote-800x523.jpg	2	f
35	8	https://store.longphuong.vn/wp-content/uploads/2024/05/cach-lam-cao-lau-13.jpg	3	f
36	8	https://static.vinwonders.com/2022/10/cao-lau-hoi-an-1.jpg	4	f
37	9	data:image/jpeg;base64,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	1	t
38	9	data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxITEhUSExMVFhUWFxgYGBgXGBgYIBsXHxgXGBgXFxcYICggGR0lHRgaITEiJSkrLi4uFyAzODMtNyotLisBCgoKDg0OGhAQGy0mICYyLS01MC8wLS0tLS8tLS0vLy8vLi0tLS0tLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAMIBAwMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAAFBgMEAAIHAQj/xABDEAABAwIEAwYDBQYFAgcBAAABAgMRACEEBRIxBkFREyJhcYGRMqGxBxRCwdFSYnLh8PEjgpKy0hWiJDNEY3OjwkP/xAAbAQACAwEBAQAAAAAAAAAAAAADBAECBQAGB//EADARAAICAQMCBAUDBQEBAAAAAAECAAMRBBIhMUEFEyJRFGGhsfBxgeEyQsHR8ZEj/9oADAMBAAIRAxEAPwDqmXN92TUTq9QV0oMxmzgtCSPOK2VmUpI0kE+tYo1VeMTZ+HcMSZypOXKbxeKcMAa3EtgEGxWVLUY6q5VSdUZJmj+KyDFElSk6iVLUQlwAGTqAOqDvI9qDZ5lOISk6cM8NoUlKnOk/CT40Pd5lmSeslLBUMYM9wTi1q0J33m5gDmfpR7GPFxns576SO0UZUVX1JKBYJvHXagOVZqnBoVKXJUAFFwFOog7AbCDyrzCZqyp0ElQQqZkwRYhJB8DRQm3pJezfyYdwC4lCtazBUJG6gBpBNrcvE035dik/dyhaglcpJSTJA5pEWB9YpJyvGlsGQmY0pk69AFrHYnlPhTBgEsrbS48lLaEyQtRAKiCe+fWfbahjhpzjKzbNHU6gAEhKgC1YlRKSJVBiRJuoeG9DXsu1Pp0Feqe9qMyegEwN9wK9zriTDOuNrCnHFNW7h0iNtIMTBsdrwKkyDEv4hKS02GxqCVu/EEgzMSLmPC0361zg9pVGx1hzArbLycI0Qt0KCniBISEyIUobXIj1qlnz5ONcKlI0KIQG41hSgIlQ6W5nlVtzPMLhFljCpSmSAs8wYMqK95Nib+O+9PL8El5Q7E93VOoGdR53uTepyF9KwRBb1GWM6wjDTTQdUtSipS0pvYxEiTHXyoXhGg9ISlSZ7ovuT0jwv4VpxTmyXMSMMhWpxKClSkqHci+5kAyb25iiOV8P4koHYrUQZ7R5RMaeYa1X/XT+GarbWXOMRbA6mTYPhhaXWwkobA7zi4EkJ/CEAQlMEyTF+tGcFgG22Q6idGtXZBMplN7qk3ANv6mtsApt1p5pLY1FAStQlPaJiCdKTY+E3qrxJniWVJGhXYNBLZVEBK1JB/NIv4dbkStQue/59pTaQcS5ieI1RHZBIIiSefgOXvXPuIszcccU44t9phG6Fd3Wbd1uDcm4m4G9HeJcQhOBSsXSsKICeZGmCFchJPheKTsaoG4LJGlBV2l9yLX5GPrXB3Jw5zKgjO2a5fh3se8ylCSlTkhSr6QlKjJg2sCIPOb7TXdshyVvDNJabEAbnmTzJPOk37KsJdbndgQlGkAAJjw9a6KbVsUMfKC9ovaOZqtutBW63KiKr0YZi7YzxNtFbpbobmOcpQezRBX47JnaevlQteNK1BBd1E7gWAHMmLUpbrEQ7e8aq0bEbjGFD6CdIVMbxcDzO016uCCQdt5peexaEaSlQhMhQ67X/rrXrmdBYKW5J5lKZ91be9LHxELnOMxj4LpiXsdjuzUExNp9OXv+VRjNQRCQNR6m1DXMvfdJUVpE7GJgAQBG0TPPnQ5eT6VScVEfu28QIO/vQG8WYNkjgwi6NMYzzGxGIHdQojUeY2P6VDiXCJG8UHxGa4c9mlpYLqBITIlQG4g7z41Wy3MX3lKJZU2oKjQr8Q3sSIJ32pxfEBnHX9II6eEHsaRVR7HmIoXmWJUlZ1JKecERQ53HHlTvmqYMVmHTjB1+deUunEnpWVHmCW8synhs2w2yXSPMRRBjGA/C8LfvT9auZPl2HIhxlpX8SEn6ilP7SFMsllrCNJS8tRUqJgI+EDTMCVHePwmvPLohYcKZu2anZywja3jlp2M+k/SpEZqsXKB9PWubOYrEs/CZjeCQfGNxVnC8ZPJG0+Cgkn1Bigto7B0MGNZSes6OjMkrgFsnwEKn0qricPgVqh3Ctk//ABCdp3A/Ol/A8X89ABjkIt6URHF6FDvJSSZB259Dvz6865UsUdSDJ3ox4xj9ZbxOAwTiChOlAIg6FaCBEW6WqniOGUvSsYpRmwEJWlIkmAlITG5+VWP+uYdaRqatfYECTzsT4e1Ss4nCGIBT1025nnY2/Ku3WD+6Thfb7QCvgYhQJcSpM/DBTz3sTP8AV6L8T43GIbGHwDDaWgmCsrSFEkRASYCd99Um+1Xyy0UylxQMKtqUZ30i5IEQPfnQXEq0qALpSTYTpMn5VIvtQ9jO8mtx3EFZbw3KA5i3bT3mUgBQSJsk6u9JvbrTZjnexUw3hm0SgBRKVDS2Bs2mLKtv8vBcZwJeC9brgULoAEAptBMg3nlNTZY8pDCUJBUqTeJmVG8Dzo5tbZniA8qtjw2Y6YV/tTrcYbdULyoCB4BMfWa04ozV0NKVr0gJ06G/GwMEcvP0r3how1pMaoGo+J3qrxVlLTmkhae7BHIg/wASfzoXxFhXJb7fxmDalS2AMRRyDNlNuSJ1pKQuTsASTYzcm0HaKb2HgtbjrmpzDvp0FtUTpHNImEqSoqEjeB0EI2AbbU+Qha5XKiohKgTNwD4+1dEw2VnEYQMIUEaT3VxJSR4SJ/nRqX5wP1ie2zJLYI+Ri1xCG22cKyklSYWmDvpJ+JXjYeHepVRlgaCiVgpVuFW7oumBzIP9Cuk8RcCrxLaU9qlCkIKEkJJsbnbqQk+lcfwAUhTjOIiy+zME/ENQMTexT86ZKHOZHGczrH2N4gFlxM3DiuthMgX8CKfnnQDHOuIfZxnasNjVMuqTpX8AEzaZJ5XF/wDLXXcT8aVbz8+h9q0qT6RAWcmXVuwK5nnnFzi8W7hmioFsCAiSVczAHSR7008WZgptAQkwtXyH9qV8BiUtLV2TSlLcI1L03UdgJiI6AUtqrgQUBxD6arad5GZSOYPAyVQVbhQMzF551A1nGlSlEwT3VQZiY+tO+bMYdbCXMWgIcB0k6oME92VJN+W81z/PM0w+FUGUMJdQfxE95Rt+Id6bxWVbpQT15+s011iqORC+HWHFJAcFyPnTDmr2IwqNOGDS0AA6T3VCRvOy5NzN/HlSbhR2QQUtEKJ1aCqVSe8bC435gWAq/is+DoKe1iBsI8fi638aTFflE7YWywWbS3T2hPL87ddQA8rSrciet9/yNVmXgVrCnBCRAASQZ3mSI6fKuaYrMyh8yowFSdI8b+lFH83cKCsd64ITAMjkQeZHTpUPoHLbiev0gKvEa1LBhjntDWBytr70Xe1UVapskxI8eY8qYMy4hGHaWvUStMAJOqNRIOoi20Hb3vXOMFjXUwlQMLIKYBvM7c5ownHBWpJNwoQoSY5EdDtt470c0MjhiTxK1W12o4Ax3hjKeLlvpWHUBSDYCCCFbyCZ2pfzDGqZKQTq1yQCIIExerGAyAJ1uOLK0qSI0goKbzKtJMExHO01ax33d1hLQJCwdSVEKJ2II7wmCBselqaF2G68SunodgCYORmpj9FfqK8pex+GUhxSQ6qx6t+fO/vWU0MnnMIaiD/TOuYlCkUByYAPuYhYBU4EhCjeED4UjoSRJ86P8a40MtkjpSbkAOLKUMvBBAJN+XQpvtNBauwD0jrFNdbuAWHM2wjL06kgEiQU2PlXOs64dWgktPqVzCVmPmLH2FPWd4d9oaS8hw8hpIPsn6xSvj3A0R2kFcXSnUQPAqIE+nvV61tr6iIqCesFZXl7/ZklWlIMFMSTsSUkHYz41ZSjSyITK5UAnUQd5EKBHXcUSyvHgsqT3NcqgWEzcW6cvSvctSyCpLix2hExBt4Coew5PEknHQyB7KwVITpeGsJ0rnU2TEqvPdvYTvNE8C0XNTCNaYSNbo0FYjaCU8zyEGE3VtRjh/HpSkpUdIJ2qTE5ekOJIddKVXhTq5uNXdWo90QIHQxSfxOTg8GDN1iHIMqPZVpSNC3CUgSBpUTa5jc+dCskw/bLdOoBLCVLWpxJGggGJJ+G99jYGomlEvK7VbgKiOzEyAJN5kSZA3n8q3wGYPKbU12ygFOnWqTICTCQOYH4omJiAOZVCjOef5l01JbuZaczRKGe072paSNKkaSCTbe/95o7kuKbThGl7ym/gZMj3oQjKmnUrQgakpMpN5J5qJNySZvVnIcKezUwQZbUbeCjP1n3FBsZVQ7RNCjPGOkZMlzZkrUkrifQA+ZqxxblJ+6rLROqQbXOnqCL2sfIGlhzhZ0nU13jcxIBv4mxvXQchylbeFaaWTqA7wN4JJJT0gTHpQq61fkDPtJXUWB8MMCclwaXEISlZ0uAQVC19ioTzo9gs+dQkJS5Mc7X84pvXksKUDMA28q8TkrXNCT5pB+dDBdmwRgxmlaaVOOQeZLh85UlrW4YATJNcfzdtClKWsElTheOme6ZJ+IACBJtvXR+LOF8ZiGwhnSlIKViVkarGywAIF7CeQPkjYrgfNkPIWGQtsbhLqTvvZSr9RW7Rp7NoJmbbYhbiKWKfUXW3kGdBGx2Ph4Ee1dw4L4mDzaWnCNaY0k8/CuR5nw1jGXEg4Z/QFXOhSgUkg3UkECNr1FlebdmsoBhabjkReSI/KmlBHEDnM6tn7b7761NKKQ3In97kI3MRyoBgcacN2mIff7VQGlEyNJMyIJsdhsLA9aKZBxAy/AdOh2ANYtqjYLjeOu9Es2SWoWtCHEn8UCf8qxv61mXV2o+4jj3/Ok1dPZWy7e853iuJjiG1qdUdZVZM93QNyU81A7A9SalyfHsKMqSCZOhSpAgi6QUg326+Yq3n+XsvrKUhIUoAhKge8bkaXBcTNLv3U4ZMr7T4juElCkxYkpNjJ+dcoVhkdYyNrHDL07wpnWeIR2nZ27QALBN9IER1AMz40JRj0tFtSkkSCCE2EknTbf+1a5nnDK0BxaQpYACFHzIMjmLk7RareSYYvw46sIQArSmDJMCBrmdJ5xvFSECLk9JlWobLMViVEZW5iFXbWAuIH4zzFjskX+LrzrbAZWl2G2e6gTqJWQSLyOpv0ii7bhdfSdXZpAgpCZ2jZUiDBnY0YzzL2ksKeYBDqYKjKlEo/EEpmARuLcudSlhbiBOn9OQYrYntGwAlvUtAVIBVBTEBML3gXtXmA+AAIKUkjSB3o5iTJMcoPSoH81dVDSEurChPcSd53Cjsat4fBP4QguCCb6DeBYiev5VFinYcw9VR4KZ+cYsPi+xVoWhatSBASJAIklWra4PwmTYR4r2eYttKZWShY5DdJ2hU2uJijb2JadOsJ7mlGrUrSEjlKthuYO9+VR56plZS0EIUREEpB03sNSrqPmY2oNYGRkTYKgJis9YqM4FTqQ4lpxQVcEmJ8YJmspzYbXpFmz4qmT4mspnd+Zi3wx7sZ59oebJcTpSaReG8yOGxCHtgDCv4TZX6+la4p9St71RdQa9SukFSbRMV7S5yZ23EOJcAcSRMWO4IPWlPP25kaRr0xO4PT5W9KrfZ/nWpH3Zw95F2yeaP2fNP0joaNZirUqY2BrH1C7cgy6jjMVDknYoCnhrcPeAiydogHnXgbEJfAAkGeVwYIPtNGsfi+1SJgEUPloNrbUFEKvysYgx15VjmzdKGXMLjkgT3VAx4855VRzjHljvaj2boAAmQlQnupEyBAHzoRluHQkhP3giCe7oN08hqNpBpnZ4UXikdmolDZMkkSojwBsnzI61K0APjqDBGstBjeMS/ockAp/Z+NSuUReL+4ooxwu/iTqW12Y5KVYx1Ed4Hzin3hbhXDYRI7NAn9o3Pub+0U4qwQUmSIEWinE0y5zmcKgs5zwtliMMssqWVajGo7ydgBe1+tW8zwhZc7SPAkdK34pwivvctqPwpJsPiuNx5JP96bXmUP4cKgSRPrzFZhTzGsrJ5HImwMIqMOhgHLsZtbyim9DoKQr3pHDWm3Q2pjyXEynSedI6TVbHKN3l9TT6dwl7M40hQPnS/nmYBhhbvQQnn3jYW8N/SjrzYOpHMjf6VRcykLSUPJnok3B8+RpqxnazcF4+xgUIC4Jk3D2afesOl0nvDur/AIhz8JEH1qw8KqZBhU4cqaSgJSozYR3oA+g+XjRHEJr0GktL1AnrM6xMNzKalEc6q43DNOiHmm3R/wC4hKvqLUQKRVd4QKa3SoEVsx4KwS7thbCpmW1Eif4VzHkIrXCZdjMOkoCkYlo7pIgx/Aox7Kmj61TUZJG1QSDwZYZHSUctew4hCJYVzQuY/wBR7w9Zpc4l4bCVlcFttStSlJlaCLzsYTMzfpYU1urSoQ4kKHiNvI7j0qINLRfDr/yKP+1X6+9LPplsGAcQ6ahkOZydteopDTaZiGwkAmNpg7Rv9aY8nyoMjViHQ48e9AgAbDYbxG9MxxGGKlB7DBtZ+JSB2aj4kojV6zQXMeFsKtZdaxTqVfsuBK48ARpIHvQbfDbwpAGZ1WqAbOZdx6+0wziUxqTCmwAOUSIjnSNinsQoBJTp/dkiU2IJi1xNielMqMM+2IS62oR1Ugn/AFJge9LeZYHGlSlIYva6XG1zsLBKiRb6UkmnvXhljNty49JjFkODDaQt5Ak7ERYbRG3v1qpxJi1qWGmW23DAIVpSIv8AiP4Y8evOaoYRWM0dmtl4TaS24ANryRAHjRfA4dAhIBN5JvKj+0Y+Q5D1NWSpskQ9NowCTNsm4WOgBcK2OlIgAgyItcg3mB5Vq5kJad0iSkib7jzPj+tFmeMsK1/hJS4XI5pJv+6jc+oqjmObYnEAoab7JJ+JSiCtX8UTpHh058qPtUCMhmz6RKq8YAYA2rKrDhp/q16rV/wrKptHvCbvlE9SKpuCakxWIqp29e3ucZxPLqJuAUkKSSCDII5HrTXk/EyXB2bsId2CuS/D91XhseXSlBx+aqrNZ+ooS1cGEDEdJ0LEYZa09xJ8/wCdVMNkLi9LSdRUbdb8z4UN4SzfFl1GHaT22s/CqbdVa9wAOs13/h7h9LAClAFw7np4CsX4AVHBMgsMRU4V+zprDAOvAOPbiRZPkPzN6NY1MKASPQe8+1M+NRApOzLErQ4Cmxv7EQflVbgFXiETmG8OhOkFRABJBk7R9eRoxhnEKQEAzYjb2pPZXKAaLZbjotzIt51RLAOskrA+I1FRKiFGYkDSDFgQmTFh1q5lGMhzQdlTHnH5gfSpsxwsBOmBcTImR72PjUWRlsOqU4pCQlJA1EC5tafCfesUIxvHPJM0S48ozzPcLpUFjYzUeWXUIok+pLrTiUEKiSki+3L2oZk+KSlUHnWbqtOpuDZ4MNXYxrK45ELPrKVgkmKvuupgXAIFvKq+ZhKkJIveg+aOHsJEy2f+02P5H0rR3Ctmr7EZipXeoI7RkSkak2t+db4tk7pv4fzoBwxmTjoICSQn8XLynn6UaxmIUkb7dKer1YrrLGLNUS2JQcxETNjzHQ9KA5nn4btEmjLGIS8SNl8vHz8aEZjk7SlELJSRuKJTq3uXdWcic1QQ4aJyuNHHHCEpASJ33kEgi221OLOI1JB6iaWnuHMIhZcDhuSSNXXeOlEk5qyhISCIAj+po62uGw0EqHvCLi6gWo8qHjPGyTCp8r/StTnLUxqE9Joq2Z5EvtxCS321jQ+mRyULKT4g/ltQbHZOpBlKtaDssW9FDkaldfSoWIqPDZkW5G42IOxHjT2l1zVHB5EDbpw446yuMMrrXoY63rbHZzh0gd+5/AO8rygUDxOeuKOhuET4a1nySNvXathtZTtz1+USXT2554+Zhd19DQ1LKUjqaHK4kdcOnCt7/jNh5ibEeN6GtZU46qVGDzU531eidh9auPYdxghaXSQBBkDqOQj9ay77rLOFUAfpzNOilV5JJ+0nwmUuSVGVKN1EmVH1k28NhRnL8ayF6DvMERBB8j4T7VRYzBYAgoIJgmYj050Nxzq1OhUplM7W6c/X51nfDjueZrnUADAjNmGNQlwiDy22+EHpWUHGYEgamQowBOsiYAAtHSsofkGU8+cxdSTXqWKs6akQRXq9gJyZg5lBTUV4lieVXXBTd9muQfeMUFEdxuFH+L8Ptv6Ch2YQEyMzoH2VcHJwrXbOJ/xnBf8AdHJI8ufU+ldAVvWNIAEcvyr01js5ZsmRKuMVvShjWdajTXjVRPlQTAJBJnrSl+O8YSDMGyUgztVjIUlTx/ZSPmaYcRgEdlJgCJJ6WNVeHMIA3qH4zqnw/D8gD60hYDkKIdSMZm+ZYdSgAmNxv0m8eMVzLiRenESr4CBoMmLTPrqPTaKdvtE4hOEwi1Igur7iPAkXV6CT5x1rm2V5qnFsEOIT2jUgJP4kECSg7ggjr0pW9CPWBkd49pQcZhvhvjlrDuaH1EIWBC99ChY6gB8J68o2p9yrKWiVLCgrV8EbBJ6HnXME8Fh5tLiWwQoAgLWr56belOPCuKeYSlDrcAWnUkxFgbHpQSaRtyOB/mdYrksVMPYvCLbCkiYVseh6/wBdKr4PD9o2pp0zrSUKiUyDaxFwfEUbOZNKTCjuOc/Wl99t5C9SEhTcnZQJ0zYn0vQdRWK7FsqO4e3tK1MWBVuDCuAxCGwGGkBCUd2Noj6+dScRqPY6WyNSiJP7vOhWa5sgJSSASDdW3LaRzqxl2JbcEhWpPXmPBX61c6tnDV5znv7SPIK4sI/mDOHMIvtgSdt7VDxJkSnHFuF5xOo2AiI2FiJ2jnTG6w433kqGneyR8zzoXxNmrjeHL4QhaU77iPGL0TR5oQ1tnOczrW85ww6dIpO8IdqnQl5xCuakkG3jIgelSvcIpYZEOtpULa1rJ1Hos3JPSD+lX8tRiCEKfASpxKVhtM91J21dVfT3oznWJS0jQSlQUm4VsPM/l40U6gklSOJBQDBE5tgsQkE99JIUUm8bc7wQD4xTNg8VhnBoP+KlSZLZQLE85JgGel6TeKmGEhKgnvqVY7EJBvY8469anyV5DUFWqCmQCJJEmEWFz7Wjxo1VIUb4RtpTJ6y/meDDKz93X3IgazICp2SrdQ8+fPoqZtjHT3UuhRPxGTA8AB8XuI8aIcVYzUgySFrICU27qR8R89h/Y0PyDCTJNaFecbjEWbHAk/CWSNuPD70pxSDulCuzBHiU94+9dCTlAYJQ23CdwpKfiHIk7n16UMw+WJQJG8b/AKUSzV1xzBFxta0uYc6laVES3ssGN4sqegV1rU8Pu/8AoF454iGrrJTPtLSMGtX/APNZ/wApr17CqQJWNH8RCf8AcRNIyM9eNi86f86v1r1vG3nc9a9L8Fb3ImQbcRuQluZgHxgUtcaZeVFL7BKSAA4kHeNlx15HyHjW4zExWgxZPOq2aDeMGdVqrEbcIDYzSEgFap8k/pWUVXhGiZKBJ/rlXtZp8Gf3E1R4snsYjzNSbVulqtHEzR5ea6q7l9kmWaMMFxdfe99vlFcLCDX0pwc0EYdAHJI/r5UjrW9OJ0PmsqHtL1IFiszE4HJgfOH9M0Hy95ITrX8IM9L9PGrXEAJvyv8AlSVmmcSQlJsPmawPENQ2/Amto9N5kNZ7njmIWjDtyAshKUj5qV4ASfSnXBaUoATsAAPICB9KR+EcvJe7TdwJAvslKjJjxhMT400ZniYlCNjuaWqtasG2w5P5gD9IXUqpYVV9BOf8X5c7j8WoqcLTDXdaCQkqUrdTgUT/AIYJgDmQgG1BneGMH3UDEuJcJgFGknVyk6YF+YpwxDJUSlNiSBblMd4+F6Fr4PWhxUPJNzcAyJ/OgHxAkklsAdpLI6KAnOYfyLAuYdtDWtTsA98p0zckAXPIj51YxgSoGN+lCMzS6tnsBCFaNOtBO5BHnMQZJ51Ce27OZlQEyZI5qKSfC4H0oQ1IbOcHJ/DGVpI5zDWSgkLSqwG0/MURYeAMWty8KQ283WXCNUBMW/M9aO4ZzUoLJsL0MkoQAJd6M5JM84vyolwBH/lOAKgSYWD3re3ua8wmDLAW8gQpRk9VWAv7bCBTBiHe62opUpInaLTHU+FSYgNvNK0H4QZGxHmKZas2MwU4746QS3kKqsPlmb5PmCXmyFDu/CUn8Ji6T4HlQXO1KZlg95td0zeRzSfETHkR1qnw4OzcMqBbdkHqNykH8vOmFLaXCG3IVpIUg85Hieux8642eYir36A/4/Q/eUdBTaSOV64/O4gjK8x+8KbcIIOmDPgbQPeo+N0pSlCzuFkSfLVb9fSroYCMQQBAGw2qTjBAcwqhGopUggASZJCAB/qNX06Elgx5zKXFdylRxEXGuoKdRSkkbWBPpM0tu4h1TkrVpb6D/agXBPUmQJkyYSbvECXcMQlxBGoxJuPcb/3pfOIPaBRMj8ugHLyFq1KWKriBZC3IkuZJmVn+w5AVcyOQkTYmoswM6Sm4iau5aimEYnrFyI0ZdiNSdKjcbeVFciID5Qq6HElKh1GxHqkmltuUwRyotlWKCnkRyKT6Gx+tMVH1CUccRHxmDLTi2ju2tSP9JIn5V63RvjVqMc/4qSr/AFIQo/M0GSK+k0PvqVvcA/SeXsGGIkoNboVWgFbJqxlMSfXWVpqrKpidiLCqhUK8S9WOGawTN+Yyq4r6U4YX/wCHB8P1r5lQkzX0N9neN7XCJ6wPfn+dZusHAMkcxiZMmqXEOZBhEkxVttUGk77SJC8Ofwq1JPgdJUk/Ij1rJ1NhSssIfT0iyxVPeVswzrtEaIVKrEgbCN/6FLAysMuBxS9SRtaI3+IH60bwQVMCY22B96i4hw5GGXIuLwCK8n8U72ZM9ONOla7FhTLM17BhLwSVF5a4vEITCJ2PMH3qyc6StvUgQo273rz57VQzVtDOGZQSHA2wnaO8YJUoSYE3NL2HWpMJKNIXBaOklajMKCI2ACgfXwNFtRndlHQf65mfVUS28nj2jyEyqYIchJVJHSAQBytE+FBc4fxCHISYQedhBg9RUOZtdh2Li8UVIJ0rKgJiCApKt5BAHQTyisyzUdYW4XElUoWR3SCLhPWIv40lZpTWxsPMbq2wFiOIne20NkayRNtW0xANp53tTplU/dFLd37KVHa4SZkptEdKHZbhkKcUEA6UydRjnvoHPx2qh9oOPW0x2aSQt3/DSi0aTdSj1sI8JoiKLHVEXHzgrVO4+r9vYf7ik02ntFydQUEzeO7ZUCPGmrJceXVhtIsTE9AIobwZwgpxIlMj8S1zB66UfiHn7034jL2cMnsWEgKF1FIFxuR3fhvFvGm719JPtxDm5S20Dn7Qww93YBGmw33F5+lUkNgNhTaiNThvzi4E9R+tWOFUtIQswLquLxYbgGw35VujN2+0WAmYIHWSdgBQhWu1Cx/2IodyswUdJRxK0hJaTpDhOq0eHeB896pu8QpS8hSgO8Q2uJGk95Ug+hqnmuOwyXFrcsRA0nUDIuNITfZRkjlNVcBhWcSlWtqxJWnvK7sAiQZnr86sQAQTnEJ5bOhI/Mw3js+bLiUhYV6gkeBNWcNmyZSlSgBMAkiD4X51zfOsK3hnkwshJSSL7GbzI22+dVcYhakN4gOAJWJAWTpA2sRe5jlzplKw5Dr+fKIWXeWCjD1DtHE6X0vh9IUie6VXgySYPhakHNcl7PvtqKkbkE3T/wAh8/rU7nEJCEoJIJSZF7G9lcgdveq330uJsyEqEd5KlHUbx3TMDnTdVbr16S9TLYuRNcCokhB2IkfnRzBD5UtZpiw2tOkEFMSPrTLgrpB6iaZVSOYKwDdC6YKa24XQTio6CfnVNCqZfs9wkuKdVsOZ6JuaYrHMDZwIA45P/jn45FI9m0A/MUCFW82xJdecd/bWpXoSSPlVMV9I06bKlU9gB9J5VzuYmbprYVoKkFFMrMrKysqJMUENVbbatXhUKztawAoE28zUgTXSPsrzkIUWifH0O/sfrXMtUmr+XY1TDiXE7j5jmKWvr3qRLA4n0c+uDQXjnLDisGoI+NELQf3hcVLw7mSMXhwpJlQT6kfqKlyzGQpTS7/mKwHXkqYwpxgiIGRZgH0JWAZFlpv3TsQY3vIotisOhaCkgQoRMwaX8S39xzJbeyHl6k+Oq/ytR3G4tKQSRbc9P6/SvHamkV2kD9p6imw2qrCAsRmSXlBh6e1bsFJMa0jY6eRtt+RirzyUvpJLkLA1ak3KkkwYkDSEhWwpO4hxJ7dt1s3SbAdN70WYzYIPaIsFX0biSb286fIO1X94H+8ovaMeNZS62xqQhx5iVbSOzUkEg37xsNhYztVvLsCsgLMLTqCkpSSbfsWHdi2wvzoflXE+HKu82rWbWtMza5phb4nLbSi0wuATAlNomRAJ6UvZyQHOJQl1XCLDJLLQ+8Pf4YVsi87RAHpyrmud47FYjFqfSyttpPdbmASkbqKZkT06RQzM86xT2JQ84o6EqshNzew3sTefSjuLfOtAB0oWoyVEDSIkSSRfaw+fMrYrXaoHPfv8/wDgnUUYO5jz9IzcMZ0CAldlEfyuOVFMyLKUuLbTqcPeImL9b2tXOPvrgLriSCG1ECQQSnbVpOw2360vK4qdVJcWpMm9942kdPDbwote8oUwDJfTAvuBxHZOdJFkyT0HWoswxaFN6mxpcKoUDCeV1gzeTO3lVP7sU6TKXCpIKVFO0gkEeBnf92os7wrbSWSjWZBC9atRC95bHOb90DaOdKU0quQIXU8V71XJ9hBGXNl17tHYcSlSmwd7j4ha8XsepHSnDBPJbeiISlG03naD1ETIETPpSrk+LSA7DIS6pQJvBJ1pAWRcCNyB0ovlmGeKVuIKVKSdgTqUkWKkW7wHhTNoww9hKaNleog8dj+8q8X4Bt0oSq+wT4g3kegFvCqGLwKOxSydRQmAkGLC0RpvI8zTFmeUqebSjUUrb7wUkjeCYMjodvHlSfgs2cSXELXB+FR0yecx4emxq+myUAB6QGqRPM9Qz85TzPDlKQpKCqFCQOaYi1+sb14vGpbABTCimwN4tufKrf3sLOlBPnyG8k9Y3qlmuEbUyVsKKtMBRJvMgXnbebWrSVuMGKuNvKQZmbc6V7pULHxFiL04ocgJ6aRQJ3LScNpPKNHnP5yfeirqCISeg+QipDZwIIg9TL7TpMAC5NvM0846MHl5Ts48NA/hN3Fe1vUUL4FyDUfvL3dbQCQTaEjdR9NqFcV5795eKxZtI0tp6JHMjqd/Ycq3fCdGbrQSOBzMrX6gIu0dTAbhvWoFeVg3r28wJsa9C61crSplpLrrKiisrsTooMPzaroAiqJw8G1SpB2rzaqw6zbyJu2q9WHFWqrorcmpE6MfBfFC8G6L/wCGTfw8fLrXZkOIfAxDN5HfSLnrqT18q+clGmngri5eEWElXcm3h/Ks/VaXfyvWER9seuPcJ2gbdTdSLiOYF4paRiXcQClpKlReB8h/euifeGMaiUEJcN4OxPPyPjW+X4EMgNhOkzJsBJO6rb15LV6UizLjibel1YWvC9Zzlr7O8eu47KCQVFS1J6WskyeVEW/skxGnvOoB63VPpA+tP3EOdO4ZaENplGjUq1ySSLHYRHzrbB8TtvIMkEXBGxHUGKsbKUOxjyP/ACDRbsb0HBiRiOFVYRlRJS7/AIcKGnUQQZlIPh9KEf8AWi+AMOUgokkA90iIm9hb3mmviTGtquzKTzuSD5g7UByBhOpa0pHaEhRULgHlPKbTcb3pKzy8k9fqJpUlyo3SLLcjcS5rdUlRmyP2LSCTzIMcudGsUg6FABKjptIEg37ySTZUT51WczVtC0JgrjUpxMmdIBJUNtSoG3OaVlY3EIQHCHNCwlaSuboJlNxaYsQDNVFbOdxg7bxUQpHWWewS+ysBYC2go6zJ7oCjpVzG4idppdxWAUkJKQhwHUVLKinbcJSfwzaedNPDuZYdntXS2SlySdIU5tpT3idhMbn8VD2crCgpUAbxE+n1FHrcoSO0LvFgyIyMZicSEq0gNJICEgmU2iCR1M3/AJVLmbJxLYDSIcSdOknSTAuUyRBOmPUUqcP5opntsMSNY7wBJPcIhUpNpvHXvUxMEg9oYUUkneAQUEbi/U7zblUWJtORL14YcduIK4fyzDsFC3lFIAWFtQTvC21BQAOkp3nnHlWJzAPulSAtDQJDcSISSfad4mwgUTxzfd16pCkJCkwSJSNMmTJmb78vWjhcIhCSW7JkG4kAbG4vF9vCh2Wb856xnTacId8OZc8WgYEgdbzNv6muecXOKQtZCTDlyABAAt5jb5UwvZwmyJ72qCEyTsCPKbUL4kylxawV90qBgbxtYnrRtICjjd0iviIDVsFxuz9op4BxagdBA1CIv48/62pnyzAq7PskAkTqWZA9z7UuMZQ7qKVHQoGNQ5imvL31ohtsFR2AEqJ/WndS/ZZkaasjJaasvFa/3Ucv3qcuFuGVYlQWsQ0L3/F/L60Q4V4EJh/FwlO+j/l18vrU/G/FIbScJhu7aFkch08z8vPZ/wAO0Fl7BQP4/WJ6zVrWODB/HPEiSPumHs0gwtQ/Goch+6D7kdBdIKq9VWBFfQdNpk09YRf+zzNlhsbcZ4DXiDereFwJWYFbvZepCoNFLrnEqB3lNw3rUGiatKRehykyalWzJxPayvNNZVp0X1NVols1fDdSdmKzDXmaG+CVoNRrFFlsVSfZihNTCCyDHJrTUatOINRFNKNUcwgcQ7wxxAppQQpUDkrp4K8K6vk3F4sl4COR5eYPKuDqFEcqz5Tfccko5Hcp/UUvbRXYMOJcMRyJ9K4gtYpAKFjUBby6HrSTmOSqaekp0g7kD4vXnShlmauIAW05KTteRThlnGsjS8m3lqHsb1ga/wAC8w7lODH9L4iauDyJrjsvCm1abEgxSllz7zJJeQQkd3UNrnmBcjbfnXTMO5hHx3FBJ6JV/wDlVDc24QeWlQYW0uRGlyUemxFZx8OdBhhHk16E9Yjpy8OqLs9/USFpO4NtKgbbgwd+VFM1zF84YoTpNoSQI7vQjY1DguE8zY1pcYUEwrSpBS6JiUjSg6t7SRQxGLfbSG3sM+2nWNXcWkwN4URcG1xSr0Pn1DpGW8m7HMEZIpQW22dLSYUZ7QSu8AAWgmCLmmdsjQpKB3pBINoixGoEmO75TN6AZiWQsrQdpIKjfedrRv05DnVnD45tSe6sE3JUOVoIUOY/rlV7PVyBLU17AVzF7MXIxSXgmFJA3mFbg+g23pxweJcXhw4kABRMgSTawmT1H9bUu/8ATkFKl9ppMyAogptMxzE/lUuBbcKClGuDyRqP0orAOoA7TqS1TZYdeYaGIEGDAAPQcj7fyodic17NfwqhQ2SCU8uptea9wvDWOcI0sOq80kW81R73p6yvgFxbaQ7h0IV1KhPqRc1WvSnPSM6nxBQvDYP7Tmi8UlL6XAnvFSZ8YI5fn4U949IeQB+LkfHlbnR9H2Y4NKgt9YEGYSSke5MmmPCIwrNmWtR/aP8AyVf2pxNC7TI1PiVWcjrOc5NwHjcT/wCcEto/aIuRvYfr7U/ZNw/g8EIbTrc5qNzPieVWMXjXDdSgE8wLCPE0j8QcXyC1hz4FwfRH/L261saPwsucL/yYmp8RLQrxVxWQS02qXOZGyPAdVfSufYhogz1rGbGazGYia9fpdKunG1P3mPZYXOTNEVlRhde6qbxBwnluO7NU1vjsx7RU0IJrdnahGld27vLBjjE2xLsmoAqvVGvIooGJwm2qva1isqZOJRbRXlTOqqIGlMRozU1opuammvYrtsjMpnDiolYOrprJqDWDO3mC14OoFYOjZFaKbFUOnUywtME4N9xlUoNuaTcHzH50yYDOmnIB7iuh2Pkef1oUvDzUK8BPKgnTEcCWFuesb23gCDR3Ls6dTGh1Q8CZ+tc5w5dbsCY6G4/l6UTwOZnUNSSPKgPoie0sLhOpYTizEi3cV52PymiLXFqz8TE+RB+sVzvA5m2YBUJ9qPM4ibzNqRs0IB5WX889jG08SNK+LDn2QfzrBm+EP/pv/rTS6h7xqdLlBOiT2k/EP7w+3m+FHw4b/sQKlGfj8LEeZSPpNA0LB51M2oVX4SsdpU6iz3hRWePHZKE+6v0qBzGvK3cV/lhP0qm9mDDfxuIT5kfTehWN40YTZsKcPlpHub/Ki16Ut/Qn0/zBNcf7mhtJ5wSepqhmfETTE61SrkhNz69PWkvNOK8Q7ICuzT0RY+qt/aKA1qU+Fk82n9hFmu9oZzziN7E90nS3+wk/7j+L6eFB01gFbgVrV1rWu1RgQJYk8yQOVooTWqk1gVV8SJqa9Cq9NaKFTJklbpVaq4NbzUESZsK2AqMGtkrrjLgSWKyte1rKiTiDlV4KyspaHmGtuVZWVIlTNK9NZWVIndp6KxVZWVcSJiamG1ZWVI6yp6TxYtUKRXtZVpEiXXrTyknuqI8iR9Kysq0rD+W4pw7rUf8AMaPNOqjc+9ZWVnXgZhBIMViFgGFKHqaX8RjHSYLiyOhUT+dZWUTSqMwVkiNeVlZT0HI62TWVlTIm1SIrKyqmTMVUSq8rK4SZsivV1lZUyZGK2FZWV0mbVlZWVEsJ7WVlZUS0/9k=	2	f
39	9	https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/rau_an_mi_quang_1_3579bc1a95.jpg	3	f
40	9	https://cdn.tgdd.vn/2021/01/CookRecipe/Avatar/mi-quang-suon-non-thumbnail-1.jpg	4	f
41	9	https://helenrecipes.com/wp-content/uploads/2021/05/Screenshot-2021-05-31-142423-1200x675.png	5	f
42	10	data:image/jpeg;base64,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	1	t
43	10	https://img-global.cpcdn.com/recipes/b235f5db0142062d/1200x630cq80/photo.jpg	2	f
44	10	https://cdnv2.tgdd.vn/mwg-static/common/Common/sdhflwse09090.jpg	3	f
45	10	https://cdn.tgdd.vn/2021/08/CookRecipe/Avatar/banh-cuon-nong-thit-bam-thumbnail.jpg	4	f
46	11	https://i.ytimg.com/vi/ZLwCwyIDJJ4/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLC28T49o72JuvhoihtNNUQvmAyCWA	1	t
47	11	https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2023_10_31_638343830775894858_cach-lam-cha-ca-10.jpg	2	f
48	11	https://chamuctaile.com/uploads/images/cha-ca.jpg	3	f
49	11	https://cdn.tgdd.vn/2021/10/CookDish/cach-bao-quan-cha-ca-song-va-da-che-bien-cuc-don-gian-ban-da-avt-1200x676.jpg	4	f
50	12	https://cdn.eva.vn/upload/3-2023/images/2023-07-12/5-cach-lam-banh-bot-loc-nhan-tom-thit-dau-xanh-tai-nha-ngon-chuan-vi-hue-12-1689149627-781-width780height591.jpg	1	t
51	12	https://cdn.tgdd.vn/2021/08/CookRecipe/Avatar/hu-tieu-go-thumbnail.jpg	2	f
52	12	https://nvhphunu.vn/wp-content/uploads/2023/11/batch_27537659454965956636883554122700616027799818n-16686523473052041984893.jpg	3	f
53	12	https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2024_3_5_638452520397205640_hu-tieu-ga.jpg	4	f
54	12	https://www.cotrang.org/public/images/tin_dang/6/73_hu-tieu-quang-ngai-bk02.jpg	5	f
55	13	https://beptruong.edu.vn/wp-content/uploads/2021/03/banh-bot-loc-tom-thit.jpg	1	t
56	13	https://cdn-media.sforum.vn/storage/app/media/wp-content/uploads/2023/10/cach-lam-banh-bot-loc-thumbnail.jpg	2	f
57	13	https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2024_2_19_638439333095612525_cach-lam-banh-bot-loc-trong-suot-thom-ngon-chuan-vi-khong-phai-ai-cung-biet-1.jpg	3	f
58	13	https://cdn.eva.vn/upload/3-2023/images/2023-07-12/5-cach-lam-banh-bot-loc-nhan-tom-thit-dau-xanh-tai-nha-ngon-chuan-vi-hue-12-1689149627-781-width780height591.jpg	4	f
59	14	data:image/jpeg;base64,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	1	t
60	14	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNG8TXRHQfGUdtgJjRLrWKEAdqBZQpghKYIw&s	2	f
61	14	https://i-giadinh.vnecdn.net/2022/08/10/Thanh-pham-1-1-8938-1660102960.jpg	3	f
62	14	https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2023_12_15_638382371677354392_cach-lam-cha-gio-tom-thit-1.png	4	f
63	14	https://file.hstatic.net/200000438723/file/1_61384613d3e04acfa07abeed78c87c04_grande.png	5	f
64	15	https://cdn.zsoft.solutions/poseidon-web/app/media/Nau-an/5.2024/cach-lam-ca-kho-to-thom-ngon-buffet-poseidon-02.jpg	1	t
65	15	https://cdn.zsoft.solutions/poseidon-web/app/media/Nau-an/5.2024/cach-lam-ca-kho-to-thom-ngon-buffet-poseidon-02.jpg	2	f
66	15	https://i.ytimg.com/vi/BfD1KwGwkqA/maxresdefault.jpg	3	f
67	15	https://cdn.zsoft.solutions/poseidon-web/app/media/Nau-an/5.2024/cach-lam-ca-kho-to-thom-ngon-buffet-poseidon-02.jpg	4	f
68	16	https://helenrecipes.com/wp-content/uploads/2021/05/Screenshot-2021-05-31-142423-1200x675.png	1	t
69	16	https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/cach-lam-thit-kho-tau-thumbnail.jpg	2	f
70	16	https://haiphu.vn/web/image/4232-c223eb26/2-cach-lam-thit-kho-tau-voi-goi-gia-vi.jpg?access_token=ae807556-6a7f-4838-bbaa-74c15eafb2a1	3	f
71	16	https://nhahangcham.com/wp-content/uploads/2024/08/Meo-de-nau-thit-kho-tau.jpg	4	f
72	17	https://i0.wp.com/vickypham.com/wp-content/uploads/2024/08/34431-eosm50_9482.jpg?fit=2500%2C1407&ssl=1	1	t
73	17	https://takestwoeggs.com/wp-content/uploads/2023/08/Ba%CC%81nh-kho%CC%A3t-mini-Vietnamese-savory-pancakes-Takestwoeggs-sq.jpg	2	f
74	17	https://takestwoeggs.com/wp-content/uploads/2023/08/Ba%CC%81nh-kho%CC%A3t-mini-Vietnamese-savory-pancakes-Takestwoeggs-sq.jpg	3	f
75	17	https://cobavungtau.com/UserFile/editor/images/Customer/B%C3%A1nh%20kh%E1%BB%8Dt%20%C4%91%E1%BA%B7c%20s%E1%BA%A3n%20V%C5%A9ng%20T%C3%A0u.jpg	4	f
76	17	https://cobavungtau.com/UserFile/editor/images/Customer/B%C3%A1nh%20kh%E1%BB%8Dt%20%C4%91%E1%BA%B7c%20s%E1%BA%A3n%20V%C5%A9ng%20T%C3%A0u.jpg	5	f
77	18	https://www.unileverfoodsolutions.com.vn/dam/global-ufs/mcos/phvn/vietnam/calcmenu/recipes/VN-recipes/red-meats-&-red-meat-dishes/shaking-beef/main-header.jpg	1	t
78	18	https://cdn.netspace.edu.vn/images/2020/04/28/cach-lam-bo-luc-lac-ngon-244971-800.jpg	2	f
79	18	https://cdn.tgdd.vn/2021/07/CookRecipe/Avatar/1200-1.jpg	3	f
80	18	https://cooponline.vn/tin-tuc/wp-content/uploads/2025/11/Bo-luc-lac-khoai-tay-chien-anh-dai-dien.png	4	f
81	19	data:image/jpeg;base64,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	1	t
82	19	data:image/jpeg;base64,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	2	f
83	19	https://www.cet.edu.vn/wp-content/uploads/2018/03/ga-nuong-mat-ong.jpg	3	f
84	19	https://cdnv2.tgdd.vn/mwg-static/common/Common/mdsds.jpg	4	f
85	20	data:image/jpeg;base64,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	1	t
86	20	data:image/jpeg;base64,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	2	f
87	20	data:image/jpeg;base64,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	3	f
88	20	data:image/jpeg;base64,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	4	f
89	20	data:image/jpeg;base64,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	5	f
\.


--
-- Data for Name: food_ingredients; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.food_ingredients (food_id, ingredient_id) FROM stdin;
1	1
1	2
1	6
1	9
1	10
1	11
1	31
1	32
2	3
2	23
2	24
2	25
2	34
2	35
3	3
3	6
3	7
3	9
3	33
4	3
4	21
4	25
4	27
5	3
5	5
5	9
5	15
5	16
5	17
5	33
6	3
6	5
6	10
6	42
6	43
7	1
7	2
7	3
7	8
7	13
8	1
8	3
8	9
8	16
9	1
9	2
9	5
9	21
9	39
9	43
10	3
10	26
10	29
11	1
11	20
11	43
11	46
12	1
12	3
12	5
12	10
13	3
13	5
13	42
14	3
14	5
14	24
14	29
14	41
15	6
15	20
15	37
15	38
16	3
16	14
16	21
16	37
17	5
17	26
17	42
18	2
18	11
18	16
18	22
19	4
19	13
19	8
20	2
20	4
20	5
20	9
20	16
20	28
20	29
\.


--
-- Data for Name: food_translations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.food_translations (translation_id, food_id, lang, name, story, ingredient, taste, style, comparison) FROM stdin;
2	1	ja	フォー	20世紀初頭に北ベトナムで発祥しました。	ライスヌードル、牛肉、ナンプラー、ハーブ、もやし、玉ねぎ、八角、シナモン	塩味、うま味、ハーブ風味	ハーブ、ライム、チリと一緒にいただきます。	ラーメンより軽く、米粉の麺を使います。
4	2	ja	バインミー	植民地時代のフランスとベトナムの融合料理です。	バゲット、パテ、豚肉、なます、きゅうり、パクチー	酸味、塩味、甘味	パンはカリッとしたものが最良。	フランスのサンドイッチに似ています。
7	1	vi	Phở	Xuất phát từ Bắc Việt Nam vào đầu thế kỷ 20	Bánh phở, Thịt bò, Nước mắm, Rau thơm, Giá đỗ, Hành, Hoa hồi, Quế	Mặn, Umami, Hương thảo	Ăn kèm rau sống, chanh và ớt. Thêm tương hoisin và tương ớt nếu thích.	Nhẹ hơn ramen, dùng bún gạo.
1	1	en	Pho	Originated in Northern Vietnam in the early 20th century	Rice noodles, beef, fish sauce, herbs, bean sprouts, onion, star anise, cinnamon	Salty, Umami, Herbal	Serve with fresh herbs, lime and chili. Add hoisin sauce and sriracha to taste.	Lighter than ramen, uses rice noodles.
9	2	vi	Bánh Mì	Sự pha trộn giữa ẩm thực Pháp và Việt trong thời kỳ thuộc địa.	Bánh mì, Pâté, Thịt heo, Rau muối chua, Dưa leo, Ngò	Chua, Mặn, Ngọt	Ăn như bữa ăn nhanh hoặc ăn vặt. Bánh mì nên giòn và mới.	Giống như bánh mì kẹp Pháp nhưng với nhân Việt Nam.
3	2	en	Banh Mi	A fusion of French and Vietnamese cuisine during colonial period	Baguette, pate, pork, pickled vegetables, cucumber, cilantro	Sour, Salty, Sweet	Eat as a quick meal or snack. Best when the bread is crispy and fresh.	Like a French sandwich but with Vietnamese fillings.
11	3	vi	Bún Chả	Món đặc sản truyền thống của Hà Nội	Thịt heo, Nước mắm, Chanh, Rau thơm, Bún	Ngọt, Chua, Mặn, Umami	Chấm thịt nướng và bún vào nước mắm chua ngọt. Thêm rau sống.	Tương tự yakitori nhưng ăn kèm bún và nước chấm.
12	3	en	Bun Cha	A traditional Hanoi specialty dish	Pork, fish sauce, lime, herbs, vermicelli	Sweet, Sour, Salty, Umami	Dip grilled pork and vermicelli in the sweet fish sauce. Add herbs and vegetables.	Similar to Japanese yakitori but served with noodles and dipping sauce.
13	4	vi	Cơm Tấm	Món ăn đường phố phổ biến ở miền Nam Việt Nam	Cơm tấm, Sườn, Trứng, Dưa chua	Ngọt, Mặn, Umami	Trộn tất cả các nguyên liệu, rưới nước mắm lên cơm.	Giống donburi ở Nhật nhưng dùng cơm tấm và sườn nướng.
14	4	en	Com Tam	Popular street food in Southern Vietnam	Broken rice, pork, egg, pickled vegetables	Sweet, Salty, Umami	Mix all ingredients together. Pour fish sauce over the rice.	Like Japanese donburi but uses broken rice and grilled pork chop.
15	5	vi	Gỏi Cuốn	Món khai vị lành mạnh của Việt Nam	Tôm, Thịt, Bánh tráng, Rau, Bún	Mùi thảo mộc	Chấm với nước sốt đậu phộng hoặc nước mắm. Ăn tươi và lạnh.	Tương tự hand roll Nhật nhưng dùng bánh tráng và nguyên liệu tươi.
16	5	en	Goi Cuon	A healthy Vietnamese appetizer	Shrimp, pork, rice paper, lettuce, mint, cilantro, vermicelli	Herbal	Dip in peanut sauce or fish sauce. Eat fresh and cold.	Similar to Japanese hand rolls but uses rice paper and fresh ingredients.
17	6	vi	Bánh Xèo	Phổ biến ở miền Trung và miền Nam Việt Nam	Bột gạo, Tôm, Thịt, Giá, Nghệ	Mặn, Umami, Mùi thảo mộc	Cuốn với rau sống, chấm với nước mắm.	Giống okonomiyaki nhưng mỏng và giòn hơn.
18	6	en	Banh Xeo	Popular in Central and Southern Vietnam	Rice flour, shrimp, pork, bean sprouts, turmeric	Salty, Umami, Herbal	Wrap in lettuce with herbs. Dip in fish sauce.	Like Japanese okonomiyaki but thinner and crispier.
19	7	vi	Bún Bò Huế	Món đặc sản kinh đô từ miền Trung	Bún, Bò, Heo, Sả, Ớt	Cay, Mặn, Umami, Mùi thảo mộc	Ăn với rau sống và chanh. Thêm ớt nếu muốn.	Phiên bản cay hơn của phở với hương sả.
20	7	en	Bun Bo Hue	Royal city specialty from Central Vietnam	Rice noodles, beef, pork, lemongrass, chili	Spicy, Salty, Umami, Herbal	Eat with fresh herbs and lime. Add chili oil for extra spice.	Spicier version of pho with lemongrass flavor. Similar to spicy ramen.
21	8	vi	Cao Lầu	Món đặc sản của phố cổ Hội An	Bún, Thịt heo, Rau, Xà lách	Mặn, Umami	Trộn bún với các topping, ăn cùng ít nước dùng.	Đặc trưng riêng, kết cấu giống một chút với udon.
22	8	en	Cao Lau	Exclusive to Hoi An ancient town	Rice noodles, pork, herbs, lettuce	Salty, Umami	Mix noodles with toppings. Eat with the small amount of broth.	Unique to Vietnam, no direct Japanese equivalent. Texture similar to udon.
23	9	vi	Mì Quảng	Món truyền thống của Quảng Nam	Bún, Bò, Tôm, Trứng, Đậu phộng, Nghệ	Mặn, Umami, Mùi thảo mộc	Trộn các nguyên liệu với nhau, thêm đậu phộng và bánh tráng.	Giống mazesoba Nhật nhưng ít nước hơn.
24	9	en	Mi Quang	Traditional dish from Quang Nam province	Rice noodles, beef, shrimp, egg, peanuts, turmeric	Salty, Umami, Herbal	Mix all ingredients together. Add peanuts and sesame crackers.	Like Japanese mazesoba (mixed noodles) with less broth.
25	10	vi	Bánh Cuốn	Món điểm tâm phổ biến ở miền Bắc	Thịt, Gạo, Nấm	Mặn, Umami	Ăn với nước mắm và hành phi. Nên ăn khi nóng.	Tương tự bánh crepe gạo của Nhật nhưng được hấp.
26	10	en	Banh Cuon	Northern Vietnamese breakfast favorite	Pork, rice, mushroom	Salty, Umami	Eat with fish sauce and fried shalllots. Best when hot.	Similar to Japanese rice crepes but steamed instead of grilled.
27	11	vi	Chả Cá	Món nổi tiếng của Hà Nội từ Cha Ca La Vong	Bún, Cá, Nghệ, Hành xanh	Mặn, Umami, Mùi thảo mộc	Nấu cá tại bàn với thì là. Trộn với bún và đậu phộng.	Giống món lẩu cá nhưng có nghệ và thì là đặc trưng.
28	11	en	Cha Ca	Famous Hanoi dish from Cha Ca La Vong restaurant	Rice noodles, fish, turmeric, green onion	Salty, Umami, Herbal	Cook fish at the table with dill. Mix with vermicelli and peanuts.	Similar to Japanese fish hot pot but with turmeric and dill.
29	12	vi	Hủ Tiếu	Món ăn sáng phổ biến ở miền Nam	Bún, Thịt heo, Tôm, Giá	Ngọt, Mặn, Umami	Ăn với chanh và ớt. Có thể ăn khô hoặc có nước.	Giống ramen nhưng nước trong và hơi ngọt.
30	12	en	Hu Tieu	Southern Vietnamese breakfast staple	Rice noodles, pork, shrimp, bean sprouts	Sweet, Salty, Umami	Eat with lime and chili. Can be served dry or with broth.	Like Japanese ramen but with clearer, sweeter broth.
31	13	vi	Bánh Bột Lọc	Món đặc sản Huế	Thịt, Tôm, Bột sắn	Mặn, Umami	Chấm với nước mắm. Nên ăn khi nóng.	Giống gyoza của Nhật nhưng lớp vỏ trong suốt.
32	13	en	Bot Loc Cake	Traditional Hue delicacy	Pork, shrimp, tapioca flour	Salty, Umami	Dip in fish sauce. Eat while hot.	Similar to Japanese gyoza but with translucent wrapper.
33	14	vi	Nem Rán/Chả Giò	Món khai vị phổ biến khắp Việt Nam	Thịt, Tôm, Cà rốt, Nấm, Bánh tráng	Mặn, Umami	Cuốn với rau sống và chấm nước mắm.	Giống chả giò Nhật nhưng chiên giòn hơn.
34	14	en	Nem Ran/Cha Gio	Popular Vietnamese appetizer nationwide	Pork, shrimp, carrot, mushroom, spring roll wrapper	Salty, Umami	Wrap in lettuce with herbs. Dip in fish sauce.	Like Japanese spring rolls but fried until very crispy.
35	15	vi	Cá Kho Tộ	Món cơm gia đình Nam Bộ	Cá, Nước mắm, Đường, Giấm	Ngọt, Mặn, Umami	Ăn với cơm trắng. Nước sốt thấm vào cơm rất hợp.	Tương tự cá kho teriyaki của Nhật nhưng caramel hơn.
36	15	en	Ca Kho To	Southern Vietnamese home-cooked meal	Fish, fish sauce, sugar, vinegar	Sweet, Salty, Umami	Eat with white rice. The sauce is perfect for soaking rice.	Similar to Japanese teriyaki fish but with caramelized sauce.
37	16	vi	Thịt Kho Tàu	Món truyền thống ngày Tết của Việt Nam	Thịt, Nước cốt dừa, Trứng, Đường	Ngọt, Mặn	Ăn với cơm trắng và dưa chua. Món truyền thống dịp Tết.	Giống kakuni của Nhật nhưng ngọt hơn và có nước dừa.
38	16	en	Thit Kho Tau	Vietnamese Lunar New Year traditional dish	Pork, coconut milk, egg, sugar	Sweet, Salty	Eat with white rice and pickled vegetables. A traditional Tet dish.	Like Japanese kakuni (braised pork belly) but sweeter with coconut.
39	17	vi	Bánh Khọt	Món nổi tiếng Vũng Tàu	Tôm, Gạo, Bột sắn	Mặn, Umami	Ăn nóng và giòn. Chấm với nước mắm và rau.	Giống takoyaki nhỏ nhưng có tôm và bột gạo.
40	17	en	Banh Khot	Vung Tau specialty dish	Shrimp, rice, tapioca flour	Salty, Umami	Eat hot and crispy. Dip in fish sauce with vegetables.	Like mini takoyaki but with shrimp and rice flour.
41	18	vi	Bò Lúc Lắc	Món Việt - Pháp kết hợp	Bò, Hành, Rau, Cà chua	Mặn, Umami	Ăn với cơm hoặc khoai tây chiên. Chấm với muối tiêu và chanh.	Giống teppanyaki nhưng với gia vị Việt.
42	18	en	Bo Luc Lac	Vietnamese-French fusion dish	Beef, onion, lettuce, tomato	Salty, Umami	Eat with rice or French fries. Dip beef in salt, pepper, and lime.	Like Japanese teppanyaki beef but with Vietnamese seasonings.
43	19	vi	Gà Nướng	Món ăn đường phố phổ biến của Việt Nam	Gà, Sả, Ớt	Mặn, Umami, Mùi thảo mộc	Ăn với cơm hoặc bún. Thêm chanh và sốt ớt.	Tương tự yakitori nhưng có ướp sả.
44	19	en	Ga Nuong	Popular Vietnamese street food	Chicken, lemongrass, chili	Salty, Umami, Herbal	Eat with rice or vermicelli. Add lime and chili sauce.	Similar to Japanese yakitori but with lemongrass marinade.
45	20	vi	Lẩu	Trải nghiệm ăn chung, nhiều loại nguyên liệu và nước dùng khác nhau	Bò, Gà, Tôm, Rau thơm, Đậu phụ, Nấm	Ngọt, Cay, Mặn, Umami	Nấu nguyên liệu tại bàn và chấm với các loại sốt.	Rất giống shabu-shabu hoặc nabemono ở Nhật.
46	20	en	Hot Pot	Communal Vietnamese dining experience	Beef, Chicken, Shrimp, Herbs, Tofu, Mushroom	Sweet, Spicy, Salty, Umami	Cook ingredients in hot broth at the table. Dip in various sauces.	Very similar to Japanese shabu-shabu or nabemono.
\.


--
-- Data for Name: foods; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.foods (food_id, name, story, ingredient, taste, style, comparison, region_id, view_count, rating, number_of_rating, created_at) FROM stdin;
8	カオラウ	ホイアンの名物で、少量のスープで食べる麺料理です。	米麺、豚肉、ハーブ、レタス	塩味、うま味	具と一緒に混ぜて少量のスープで食べます。	独特の食感で、うどんに近い部分があります。	2	540	4.60	0	2025-12-19 13:28:53.95091
9	ミークアン	クアンナム省の伝統料理で、ピーナッツやせんべいを添えることが多いです。	米麺、牛肉、エビ、卵、ピーナッツ、ターメリック	塩味、うま味、ハーバル	全ての具を混ぜて食べます。ピーナッツを加えるのが特徴です。	マゼソバのようですが、スープは少なめです。	2	620	4.70	0	2025-12-19 13:28:53.95091
10	バインクオン	北部の朝食の定番で、蒸して提供されます。	豚肉、米、きのこ	塩味、うま味	魚醤と揚げネギを添えて。	熱いうちに食べるのが一番。	1	580	4.50	0	2025-12-19 13:28:53.95091
11	チャーカー	ハノイの名物料理で、ターメリックとディルで味付けした魚を使用します。	ビーフン、魚、ターメリック、青ねぎ	塩味、うま味、ハーバル	テーブルで魚を調理して、ビーフンとピーナッツを混ぜて食べます。	魚の鍋料理に似ていますが、ターメリックとディルが特徴です。	1	490	4.80	0	2025-12-19 13:28:53.95091
12	フーティウ	南部の朝食の定番で、澄んだ甘めのスープが特徴です。	ライスヌードル、豚肉、エビ、もやし	甘味、塩味、うま味	ライムとチリを添えて。	汁あり・汁なしどちらでも食べられます。	3	710	4.60	0	2025-12-19 13:28:53.95091
13	バインボットロック	フエの伝統的な料理で、透き通った皮が特徴です。	豚肉、エビ、タピオカ粉	塩味、うま味		魚醤につけて熱いうちに食べます。	2	420	4.40	0	2025-12-19 13:28:53.95091
14	ネムラン／チャーヨー	ベトナム全国で人気の前菜です。	豚肉、エビ、にんじん、きのこ、ライスペーパー	塩味、うま味	レタスとハーブで包んで、魚醤につけて食べます。		\N	890	4.70	0	2025-12-19 13:28:53.95091
15	カーカー	南部の家庭料理で、魚を甘辛く煮込んだものです。	魚、魚醤、砂糖、酢	甘味、塩味、うま味	白飯と一緒に食べます。	ソースはご飯にぴったりです。	3	520	4.50	0	2025-12-19 13:28:53.95091
16	ティットホー	旧正月に食べられる伝統料理で、豚の角煮と卵を使います。	豚肉、ココナッツミルク、卵、砂糖	甘味、塩味	白飯と一緒に食べ、なますを添えるのが伝統です。		3	610	4.60	0	2025-12-19 13:28:53.95091
17	バインコット	ヴンタウの名物で、小さなココナッツ風味の揚げパンです。	エビ、米、タピオカ粉	塩味、うま味	熱いうちにカリッと食べます。	野菜と一緒に魚醤で食べます。	3	380	4.50	0	2025-12-19 13:28:53.95091
18	ボールックラック	ベトナム・フランスの融合料理で、香ばしく炒めた牛肉が特徴です。	牛肉、玉ねぎ、レタス、トマト	塩味、うま味	白飯やフライドポテトと一緒に。	塩こしょうとライムで味を調えます。	3	720	4.70	0	2025-12-19 13:28:53.95091
19	ガーヌォン	馴染み深いベトナムの屋台料理で、レモングラスでマリネした鶏が特徴です。	鶏肉、レモングラス、チリ	塩味、うま味、ハーバル	白飯やビーフンと一緒に。	ライムとチリソースを添えます。	\N	660	4.60	0	2025-12-19 13:28:53.95091
2	バインミー	植民地時代にフランスとベトナムの食文化が融合して生まれました。	バゲット、パテ、豚肉、なます、きゅうり、パクチー	酸味、塩味、甘味	軽食として最適。パンはカリッと新鮮なものが一番。	フランスのサンドイッチに似ていますが、具材はベトナム風です。	\N	980	4.00	1	2025-12-19 13:28:53.95091
1	フォー	20世紀初頭に北ベトナムで発祥しました。	ライスヌードル、牛肉、ヌクマム（魚醤）、ハーブ、もやし、玉ねぎ、八角、シナモン	塩味、うま味、ハーブ風味	ハーブ、ライム、チリと一緒にいただきます。ホイシンやチリソースはお好みで。	ラーメンより軽く、米の麺を使います。	1	1250	5.00	2	2025-12-19 13:28:53.95091
3	ブンチャー	ハノイの伝統料理で、炭火焼きの豚と甘酸っぱいタレでいただきます。	豚肉、魚醤、ライム、ハーブ、ビーフン（ヴェルミチェッリ）	甘味、酸味、塩味、うま味	グリルした豚とビーフンを甘酸っぱいタレに浸して食べます。ハーブや野菜を添えて。	焼き鳥に似ていますが、麺やつけダレと一緒に出されます。	1	850	5.00	1	2025-12-19 13:28:53.95091
4	コムタム	南部で人気の屋台料理です。	壊れた米（コムタム）、豚、卵、なます	甘味、塩味、うま味	全ての具材を混ぜて、魚醤をかけていただきます。	ドンブリのようですが、壊れた米と豚のグリルを使います。	3	920	4.00	1	2025-12-19 13:28:53.95091
5	ゴイクン	ヘルシーなベトナムの前菜で、新鮮な材料をライスペーパーで巻きます。	エビ、豚肉、米の皮、レタス、ミント、パクチー、ビーフン	ハーバル（爽やか）	ピーナッツソースや魚醤につけて、冷たく新鮮に食べます。	日本の手巻きに似ていますが、ライスペーパーを使用します。	\N	750	5.00	1	2025-12-19 13:28:53.95091
6	バインセオ	中部および南部で人気の料理です。	米粉、エビ、豚肉、もやし、ターメリック	塩味、うま味、ハーバル	レタスとハーブで包んで、魚醤につけて食べます。	お好み焼きに似ていますが、薄くてカリッとしています。	2	680	5.00	1	2025-12-19 13:28:53.95091
7	ブンボーフェ	中央ベトナムの王宮料理が起源の辛いスープ麺です。	ライスヌードル、牛、豚、レモングラス、チリ	辛味、塩味、うま味、ハーバル	ハーブとライムを添えて。辛さは好みで調整します。	レモングラスの風味がある辛いフォーのようです。	2	920	5.00	1	2025-12-19 13:28:53.95091
20	ラウ	みんなで囲んで食べる鍋料理で、具材やスープのバリエーションが豊富です。	牛肉、鶏肉、エビ、ハーブ、豆腐、きのこ	甘味、辛味、塩味、うま味	テーブルで材料を煮て、各種ソースでいただきます。		\N	950	5.00	1	2025-12-19 13:28:53.95091
\.


--
-- Data for Name: i18n; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.i18n (id, key, lang, value) FROM stdin;
1	app.title	vi	Betomeshi - Khám phá ẩm thực Việt
2	app.title	en	Betomeshi - Discover Vietnamese Cuisine
3	app.title	ja	Betomeshi - ベトナム料理を発見
4	nav.home	vi	Trang chủ
5	nav.home	en	Home
6	nav.home	ja	ホーム
7	nav.foods	vi	Món ăn
8	nav.foods	en	Foods
9	nav.foods	ja	料理
10	nav.restaurants	vi	Nhà hàng
11	nav.restaurants	en	Restaurants
12	nav.restaurants	ja	レストラン
13	nav.favorites	vi	Yêu thích
14	nav.favorites	en	Favorites
15	nav.favorites	ja	お気に入り
16	food.description	vi	Mô tả
17	food.description	en	Description
18	food.description	ja	説明
19	food.recipe	vi	Công thức
20	food.recipe	en	Recipe
21	food.recipe	ja	レシピ
22	food.origin	vi	Nguồn gốc
23	food.origin	en	Origin Story
24	food.origin	ja	由来
25	food.ingredients	vi	Nguyên liệu
26	food.ingredients	en	Ingredients
27	food.ingredients	ja	材料
28	food.flavors	vi	Hương vị
29	food.flavors	en	Flavors
30	food.flavors	ja	味
31	review.title	vi	Đánh giá
32	review.title	en	Reviews
33	review.title	ja	レビュー
34	review.write	vi	Viết đánh giá
35	review.write	en	Write a Review
36	review.write	ja	レビューを書く
37	action.search	vi	Tìm kiếm
38	action.search	en	Search
39	action.search	ja	検索
40	action.filter	vi	Lọc
41	action.filter	en	Filter
42	action.filter	ja	フィルター
43	action.favorite	vi	Thêm vào yêu thích
44	action.favorite	en	Add to Favorites
45	action.favorite	ja	お気に入りに追加
\.


--
-- Data for Name: ingredients; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.ingredients (ingredient_id, name) FROM stdin;
1	Rice Noodles
2	Beef
3	Pork
4	Chicken
5	Shrimp
6	Fish Sauce
7	Lime
8	Chili
9	Herbs
10	Bean Sprouts
11	Onion
12	Garlic
13	Lemongrass
14	Coconut Milk
15	Rice Paper
16	Lettuce
17	Mint
18	Cilantro
19	Basil
20	Fish
21	Egg
22	Tomato
23	Cucumber
24	Carrot
25	Pickled Vegetables
26	Rice
27	Broken Rice
28	Tofu
29	Mushroom
30	Ginger
31	Star Anise
32	Cinnamon
33	Vermicelli
34	Baguette
35	Pate
36	Soy Sauce
37	Sugar
38	Vinegar
39	Peanuts
40	Sesame
41	Spring Roll Wrapper
42	Tapioca Flour
43	Turmeric
44	Pork Skin
45	Chinese Sausage
46	Green Onion
\.


--
-- Data for Name: regions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.regions (region_id, name) FROM stdin;
1	Northern Vietnam
2	Central Vietnam
3	Southern Vietnam
\.


--
-- Data for Name: restaurant_facilities; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.restaurant_facilities (restaurant_id, facility_name) FROM stdin;
1	Card Payment
1	WiFi
1	Air Conditioning
2	Takeout
2	Street Food
3	Card Payment
3	Air Conditioning
3	WiFi
4	Parking
4	Card Payment
5	Card Payment
5	Beer/Alcohol
5	Late Night
6	WiFi
6	Air Conditioning
6	Card Payment
7	Parking
7	Air Conditioning
8	Takeout
8	Cash Only
9	Air Conditioning
9	WiFi
9	Card Payment
10	Parking
10	Private Room
10	Air Conditioning
10	Card Payment
10	Beer/Alcohol
11	Card Payment
11	WiFi
11	Air Conditioning
11	Parking
12	Card Payment
12	Air Conditioning
12	WiFi
13	Card Payment
13	Air Conditioning
13	WiFi
13	Private Room
14	Takeout
14	Cash Only
15	WiFi
15	Air Conditioning
15	Takeout
16	Card Payment
16	WiFi
16	Air Conditioning
17	Card Payment
17	WiFi
17	Takeout
18	Takeout
18	Street Food
19	Card Payment
19	Beer/Alcohol
19	Air Conditioning
20	Card Payment
20	WiFi
20	Air Conditioning
20	Private Room
\.


--
-- Data for Name: restaurant_foods; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.restaurant_foods (restaurant_id, food_id, price, is_recommended) FROM stdin;
1	1	65000.00	t
1	10	45000.00	f
2	2	35000.00	t
3	3	70000.00	t
3	14	50000.00	f
4	4	55000.00	t
4	16	60000.00	f
5	20	300000.00	t
5	5	45000.00	f
6	6	70000.00	t
6	14	55000.00	f
7	7	60000.00	t
7	13	40000.00	f
8	12	50000.00	t
8	5	35000.00	f
9	5	40000.00	t
9	14	45000.00	t
10	20	350000.00	t
10	18	120000.00	f
\.


--
-- Data for Name: restaurant_translations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.restaurant_translations (translation_id, restaurant_id, lang, name, address) FROM stdin;
5	1	vi	Phở Hà Nội	123 Nguyễn Huệ, Quận 1, TP.HCM
1	1	en	Hanoi Pho	123 Nguyen Hue, District 1, Ho Chi Minh City
2	1	ja	ハノイのフォー	123 Nguyễn Huệ, 第1区, ホーチミン市
8	2	vi	Bánh Mì Huỳnh Hoa	26 Lê Thị Riêng, Quận 1, TP.HCM
3	2	en	Huynh Hoa Banh Mi	26 Le Thi Rieng, District 1, Ho Chi Minh City
4	2	ja	フインホア バインミー	26 Le Thị Riêng, 第1区, ホーチミン市
11	3	vi	Bún Chả Hà Nội	456 Trần Hưng Đạo, Quận 5, TP.HCM
12	3	en	Bun Cha Hanoi	456 Tran Hung Dao, District 5, Ho Chi Minh City
13	3	ja	ブンチャー・ハノイ	456 Trần Hưng Đạo, 第5区, ホーチミン市
14	4	vi	Cơm Tấm Sườn Nướng	789 Hai Bà Trưng, Quận 3, TP.HCM
15	4	en	Com Tam Suon Nuong	789 Hai Ba Trung, District 3, Ho Chi Minh City
16	4	ja	コムタム・スーンヌオン	789 Hai Bà Trưng, 第3区, ホーチミン市
17	5	vi	Quán Ốc Oanh	234 Võ Văn Tần, Quận 3, TP.HCM
18	5	en	Oc Oanh	234 Vo Van Tan, District 3, Ho Chi Minh City
19	5	ja	クアンオック・オアン	234 Võ Văn Tần, 第3区, ホーチミン市
20	6	vi	Bánh Xèo 46A	46A Đinh Công Tráng, Quận 1, TP.HCM
21	6	en	Banh Xeo 46A	46A Dinh Cong Trang, District 1, Ho Chi Minh City
22	6	ja	バインセオ46A	46A Đinh Công Tráng, 第1区, ホーチミン市
23	7	vi	Bún Bò Huế Xuân Trường	321 Lê Văn Sỹ, Quận 3, TP.HCM
24	7	en	Bun Bo Hue Xuan Truong	321 Le Van Sy, District 3, Ho Chi Minh City
25	7	ja	ブンボーフェ・スアンチュオン	321 Lê Văn Sỹ, 第3区, ホーチミン市
26	8	vi	Hủ Tiếu Nam Vang	567 Nguyễn Trãi, Quận 5, TP.HCM
27	8	en	Hu Tieu Nam Vang	567 Nguyen Trai, District 5, Ho Chi Minh City
28	8	ja	フーティウ・ナムバン	567 Nguyễn Trãi, 第5区, ホーチミン市
29	9	vi	Gỏi Cuốn Sài Gòn	890 Pasteur, Quận 1, TP.HCM
30	9	en	Goi Cuon Saigon	890 Pasteur, District 1, Ho Chi Minh City
31	9	ja	ゴイクン・サイゴン	890 Pasteur, 第1区, ホーチミン市
32	10	vi	Lẩu Thái Hải Sản	111 Nguyễn Đình Chiểu, Quận 3, TP.HCM
33	10	en	Thai Seafood Hot Pot	111 Nguyen Dinh Chieu, District 3, Ho Chi Minh City
34	10	ja	ラウ・タイ海鮮	111 Nguyễn Đình Chiểu, 第3区, ホーチミン市
35	11	vi	Phở Thìn Bờ Hồ	13 Lò Đúc, Hai Bà Trưng, Hà Nội
36	11	en	Pho Thin Hoan Kiem	13 Lo Duc, Hai Ba Trung, Hanoi
37	11	ja	フォー・ティン	13 Lò Đúc, ハイバーチュン区, ハノイ市
38	12	vi	Bún Chả Đắc Kim	1 Hàng Mành, Hoàn Kiếm, Hà Nội
39	12	en	Bun Cha Dac Kim	1 Hang Manh, Hoan Kiem, Hanoi
40	12	ja	ブンチャー・ダックキム	1 Hàng Mành, ホアンキエム区, ハノイ市
41	13	vi	Chả Cá Lã Vọng	14 Chả Cá, Hoàn Kiếm, Hà Nội
42	13	en	Cha Ca La Vong	14 Cha Ca, Hoan Kiem, Hanoi
43	13	ja	チャーカー・ラーボン	14 Chả Cá, ホアンキエム区, ハノイ市
44	14	vi	Bánh Cuốn Bà Xuân	14 Hàng Gà, Hoàn Kiếm, Hà Nội
45	14	en	Banh Cuon Ba Xuan	14 Hang Ga, Hoan Kiem, Hanoi
46	14	ja	バインクオン・バーシュアン	14 Hàng Gà, ホアンキエム区, ハノイ市
47	15	vi	Phở Gia Truyền Bát Đàn	49 Bát Đàn, Hoàn Kiếm, Hà Nội
48	15	en	Pho Bat Dan Traditional	49 Bat Dan, Hoan Kiem, Hanoi
49	15	ja	フォー・バットダン	49 Bát Đàn, ホアンキエム区, ハノイ市
50	16	vi	Bún Bò Nam Bộ	67 Hàng Điếu, Hoàn Kiếm, Hà Nội
51	16	en	Bun Bo Nam Bo	67 Hang Dieu, Hoan Kiem, Hanoi
52	16	ja	ブンボー・ナムボー	67 Hàng Điếu, ホアンキエム区, ハノイ市
53	17	vi	Nem Phùng	26 Hàng Bạc, Hoàn Kiếm, Hà Nội
54	17	en	Nem Phung	26 Hang Bac, Hoan Kiem, Hanoi
55	17	ja	ネム・フング	26 Hàng Bạc, ホアンキエム区, ハノイ市
56	18	vi	Bánh Mì 25	25 Hàng Cá, Hoàn Kiếm, Hà Nội
57	18	en	Banh Mi 25	25 Hang Ca, Hoan Kiem, Hanoi
58	18	ja	バインミー25	25 Hàng Cá, ホアンキエム区, ハノイ市
59	19	vi	Bò Tùng Xéo	34 Cầu Gỗ, Hoàn Kiếm, Hà Nội
60	19	en	Bo Tung Xeo	34 Cau Go, Hoan Kiem, Hanoi
61	19	ja	ボー・トゥングセオ	34 Cầu Gỗ, ホアンキエム区, ハノイ市
62	20	vi	Gà Tần Đồng Xuân	33 Hàng Giấy, Hoàn Kiếm, Hà Nội
63	20	en	Ga Tan Dong Xuan	33 Hang Giay, Hoan Kiem, Hanoi
64	20	ja	ガータン・ドンシュアン	33 Hàng Giấy, ホアンキエム区, ハノイ市
\.


--
-- Data for Name: restaurants; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.restaurants (restaurant_id, name, address, latitude, longitude, open_time, close_time, price_range, phone_number) FROM stdin;
1	ハノイのフォー	123 Nguyễn Huệ, 第1区, ホーチミン市	10.77346000	106.70217000	06:00:00	22:00:00	30,000 - 80,000 VND	0901234567
2	フインホアのバインミー	26 Lê Thị Riêng, 第1区, ホーチミン市	10.76839000	106.69244000	15:00:00	23:30:00	20,000 - 50,000 VND	0902345678
3	ブンチャー・ハノイ	456 Trần Hưng Đạo, 第5区, ホーチミン市	10.75523000	106.67248000	10:00:00	21:00:00	40,000 - 90,000 VND	0903456789
4	コムタム・スーンヌオン	789 Hai Bà Trưng, 第3区, ホーチミン市	10.78251000	106.68876000	06:30:00	20:00:00	35,000 - 70,000 VND	0904567890
5	クアンオック・オアン	234 Võ Văn Tần, 第3区, ホーチミン市	10.77943000	106.69110000	16:00:00	02:00:00	50,000 - 200,000 VND	0905678901
6	バインセオ46A	46A Đinh Công Tráng, 第1区, ホーチミン市	10.77234000	106.69567000	11:00:00	21:30:00	40,000 - 100,000 VND	0906789012
7	ブンボーフェ・スアンチュオン	321 Lê Văn Sỹ, 第3区, ホーチミン市	10.78456000	106.67893000	06:00:00	22:00:00	35,000 - 75,000 VND	0907890123
8	フーティウ・ナムバン	567 Nguyễn Trãi, 第5区, ホーチミン市	10.75678000	106.66543000	05:30:00	14:00:00	30,000 - 60,000 VND	0908901234
9	ゴイクン・サイゴン	890 Pasteur, 第1区, ホーチミン市	10.77890000	106.69876000	10:00:00	22:00:00	25,000 - 80,000 VND	0909012345
10	ラウ・タイ海鮮	111 Nguyễn Đình Chiểu, 第3区, ホーチミン市	10.77654000	106.68765000	11:00:00	23:00:00	150,000 - 500,000 VND	0910123456
11	フォー・ティン	13 Lò Đúc, ハイバーチュン区, ハノイ市	21.01796000	105.84817000	06:00:00	21:30:00	40,000 - 80,000 VND	0911234567
12	ブンチャー・ダックキム	1 Hàng Mành, ホアンキエム区, ハノイ市	21.03508000	105.85243000	10:00:00	21:00:00	50,000 - 100,000 VND	0912345678
13	チャーカー・ラーボン	14 Chả Cá, ホアンキエム区, ハノイ市	21.02946000	105.85175000	11:00:00	21:00:00	80,000 - 150,000 VND	0913456789
14	バインクオン・バーシュアン	14 Hàng Gà, ホアンキエム区, ハノイ市	21.03255000	105.84987000	06:00:00	20:00:00	30,000 - 60,000 VND	0914567890
15	フォー・バットダン	49 Bát Đàn, ホアンキエム区, ハノイ市	21.03068000	105.84729000	06:00:00	22:00:00	35,000 - 70,000 VND	0915678901
16	ブンボー・ナムボー	67 Hàng Điếu, ホアンキエム区, ハノイ市	21.03421000	105.85326000	09:00:00	22:00:00	40,000 - 80,000 VND	0916789012
17	ネム・フング	26 Hàng Bạc, ホアンキエム区, ハノイ市	21.03387000	105.85124000	11:00:00	22:00:00	50,000 - 120,000 VND	0917890123
18	バインミー25	25 Hàng Cá, ホアンキエム区, ハノイ市	21.03299000	105.84892000	06:30:00	22:00:00	15,000 - 40,000 VND	0918901234
19	ボー・トゥングセオ	34 Cầu Gỗ, ホアンキエム区, ハノイ市	21.02835000	105.85243000	15:00:00	23:00:00	60,000 - 150,000 VND	0919012345
20	ガータン・ドンシュアン	33 Hàng Giấy, ホアンキエム区, ハノイ市	21.03654000	105.85012000	10:00:00	22:00:00	70,000 - 180,000 VND	0920123456
\.


--
-- Data for Name: review; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.review (id, user_id, comment, rating, food_id) FROM stdin;
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.reviews (review_id, user_id, target_id, type, rating, comment, created_at) FROM stdin;
1	2	1	food	5	Authentic Hanoi Pho! The broth is so flavorful and aromatic.	2024-12-01 10:30:00
2	3	1	food	5	Best pho in town. Beef is tender and fresh herbs are perfect.	2024-12-02 12:15:00
3	4	2	food	4	Great banh mi but a bit expensive. Still delicious though!	2024-12-01 15:45:00
4	2	3	food	5	Bun cha is amazing! Perfectly grilled pork with great dipping sauce.	2024-12-03 11:20:00
5	5	4	food	4	Good com tam, generous portions. Pork chop could be more flavorful.	2024-12-02 19:30:00
6	3	5	food	5	Fresh and healthy spring rolls. Love the peanut sauce!	2024-12-04 13:00:00
7	4	6	food	5	Crispy and delicious banh xeo. Must try with lettuce wrap!	2024-12-03 18:45:00
8	2	7	food	5	Spicy and flavorful! Authentic Hue taste.	2024-12-05 09:15:00
9	5	20	food	5	Perfect for group dining. Fresh ingredients and tasty broth.	2024-12-04 20:00:00
10	2	1	restaurant	5	Clean restaurant with fast service. Highly recommend!	2024-12-01 10:35:00
11	3	2	restaurant	4	Always crowded but worth the wait. Cash only though.	2024-12-02 16:00:00
12	4	3	restaurant	5	Friendly staff and authentic Northern Vietnamese food.	2024-12-03 11:30:00
13	5	5	restaurant	4	Great seafood selection. A bit noisy but fun atmosphere.	2024-12-04 21:00:00
14	2	6	restaurant	5	Best banh xeo I've ever had. Staff taught me how to eat it properly!	2024-12-03 19:00:00
\.


--
-- Data for Name: user_preferences; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.user_preferences (preference_id, user_id, favorite_taste, disliked_ingredients, dietary_criteria, updated_at) FROM stdin;
1	2	Spicy, Sour	Liver, Intestines	No Organ Meat	2025-12-19 13:28:53.95091
2	3	Sweet, Umami	Chili	Mild Spice Only	2025-12-19 13:28:53.95091
3	4	Herbal, Salty	Pork	No Pork	2025-12-19 13:28:53.95091
4	5	All flavors	\N	Vegetarian Options Preferred	2025-12-19 13:28:53.95091
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (user_id, email, password_hash, full_name, birth_date, avatar_url, role, created_at) FROM stdin;
1	admin@betomeshi.com	$2a$10$N9qo8uLOickgx2ZMRZoMye.IcZzeF7Z5R7S7S7S7S7S7S7S7S7S7S7	Admin User	1990-01-15	/avatars/admin.jpg	admin	2025-12-19 13:28:53.95091
2	user1@example.com	$2a$10$N9qo8uLOickgx2ZMRZoMyeIjNejKqH7KPG7KPG7KPG7KPG7KPG7KP	Nguyễn Văn A	1995-05-20	/avatars/user1.jpg	user	2025-12-19 13:28:53.95091
3	user2@example.com	$2a$10$N9qo8uLOickgx2ZMRZoMyeIjNejKqH7KPG7KPG7KPG7KPG7KPG7KP	Trần Thị B	1992-08-10	/avatars/user2.jpg	user	2025-12-19 13:28:53.95091
4	user3@example.com	$2a$10$N9qo8uLOickgx2ZMRZoMyeIjNejKqH7KPG7KPG7KPG7KPG7KPG7KP	Lê Văn C	1998-03-25	/avatars/user3.jpg	user	2025-12-19 13:28:53.95091
5	user4@example.com	$2a$10$N9qo8uLOickgx2ZMRZoMyeIjNejKqH7KPG7KPG7KPG7KPG7KPG7KP	Phạm Thị D	1993-11-30	/avatars/user4.jpg	user	2025-12-19 13:28:53.95091
\.


--
-- Name: conversation_phrases_phrase_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.conversation_phrases_phrase_id_seq', 18, true);


--
-- Name: favorites_favorite_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.favorites_favorite_id_seq', 12, true);


--
-- Name: flavors_flavor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.flavors_flavor_id_seq', 7, true);


--
-- Name: food_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.food_id_seq', 1, false);


--
-- Name: food_image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.food_image_id_seq', 1, false);


--
-- Name: food_images_food_image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.food_images_food_image_id_seq', 89, true);


--
-- Name: food_translations_translation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.food_translations_translation_id_seq', 87, true);


--
-- Name: foods_food_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.foods_food_id_seq', 20, true);


--
-- Name: i18n_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.i18n_id_seq', 45, true);


--
-- Name: ingredients_ingredient_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.ingredients_ingredient_id_seq', 46, true);


--
-- Name: regions_region_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.regions_region_id_seq', 3, true);


--
-- Name: restaurant_translations_translation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.restaurant_translations_translation_id_seq', 104, true);


--
-- Name: restaurants_restaurant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.restaurants_restaurant_id_seq', 20, true);


--
-- Name: review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.review_id_seq', 1, false);


--
-- Name: reviews_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.reviews_review_id_seq', 14, true);


--
-- Name: user_preferences_preference_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.user_preferences_preference_id_seq', 4, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.users_user_id_seq', 5, true);


--
-- Name: conversation_phrases conversation_phrases_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.conversation_phrases
    ADD CONSTRAINT conversation_phrases_pkey PRIMARY KEY (phrase_id);


--
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (favorite_id);


--
-- Name: favorites favorites_user_id_target_id_type_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_target_id_type_key UNIQUE (user_id, target_id, type);


--
-- Name: flavors flavors_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.flavors
    ADD CONSTRAINT flavors_pkey PRIMARY KEY (flavor_id);


--
-- Name: food_flavors food_flavors_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.food_flavors
    ADD CONSTRAINT food_flavors_pkey PRIMARY KEY (food_id, flavor_id);


--
-- Name: food_image food_image_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.food_image
    ADD CONSTRAINT food_image_pkey PRIMARY KEY (id);


--
-- Name: food_images food_images_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.food_images
    ADD CONSTRAINT food_images_pkey PRIMARY KEY (food_image_id);


--
-- Name: food_ingredients food_ingredients_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.food_ingredients
    ADD CONSTRAINT food_ingredients_pkey PRIMARY KEY (food_id, ingredient_id);


--
-- Name: food food_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.food
    ADD CONSTRAINT food_pkey PRIMARY KEY (id);


--
-- Name: food_translations food_translations_food_id_lang_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.food_translations
    ADD CONSTRAINT food_translations_food_id_lang_key UNIQUE (food_id, lang);


--
-- Name: food_translations food_translations_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.food_translations
    ADD CONSTRAINT food_translations_pkey PRIMARY KEY (translation_id);


--
-- Name: foods foods_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.foods
    ADD CONSTRAINT foods_pkey PRIMARY KEY (food_id);


--
-- Name: i18n i18n_key_lang_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.i18n
    ADD CONSTRAINT i18n_key_lang_key UNIQUE (key, lang);


--
-- Name: i18n i18n_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.i18n
    ADD CONSTRAINT i18n_pkey PRIMARY KEY (id);


--
-- Name: ingredients ingredients_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ingredients
    ADD CONSTRAINT ingredients_pkey PRIMARY KEY (ingredient_id);


--
-- Name: regions regions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.regions
    ADD CONSTRAINT regions_pkey PRIMARY KEY (region_id);


--
-- Name: restaurant_facilities restaurant_facilities_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.restaurant_facilities
    ADD CONSTRAINT restaurant_facilities_pkey PRIMARY KEY (restaurant_id, facility_name);


--
-- Name: restaurant_foods restaurant_foods_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.restaurant_foods
    ADD CONSTRAINT restaurant_foods_pkey PRIMARY KEY (restaurant_id, food_id);


--
-- Name: restaurant_translations restaurant_translations_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.restaurant_translations
    ADD CONSTRAINT restaurant_translations_pkey PRIMARY KEY (translation_id);


--
-- Name: restaurant_translations restaurant_translations_restaurant_id_lang_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.restaurant_translations
    ADD CONSTRAINT restaurant_translations_restaurant_id_lang_key UNIQUE (restaurant_id, lang);


--
-- Name: restaurants restaurants_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.restaurants
    ADD CONSTRAINT restaurants_pkey PRIMARY KEY (restaurant_id);


--
-- Name: review review_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (review_id);


--
-- Name: user_preferences user_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_pkey PRIMARY KEY (preference_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: idx_favorites_target; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_favorites_target ON public.favorites USING btree (target_id, type);


--
-- Name: idx_favorites_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_favorites_user ON public.favorites USING btree (user_id);


--
-- Name: idx_food_translations_food_lang; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_food_translations_food_lang ON public.food_translations USING btree (food_id, lang);


--
-- Name: idx_foods_name; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_foods_name ON public.foods USING btree (name);


--
-- Name: idx_foods_region; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_foods_region ON public.foods USING btree (region_id);


--
-- Name: idx_i18n_key_lang; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_i18n_key_lang ON public.i18n USING btree (key, lang);


--
-- Name: idx_restaurant_translations_rest_lang; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_restaurant_translations_rest_lang ON public.restaurant_translations USING btree (restaurant_id, lang);


--
-- Name: idx_restaurants_location; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_restaurants_location ON public.restaurants USING btree (latitude, longitude);


--
-- Name: idx_restaurants_name; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_restaurants_name ON public.restaurants USING btree (name);


--
-- Name: idx_reviews_created; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_reviews_created ON public.reviews USING btree (created_at);


--
-- Name: idx_reviews_target; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_reviews_target ON public.reviews USING btree (target_id, type);


--
-- Name: idx_reviews_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_reviews_user ON public.reviews USING btree (user_id);


--
-- Name: idx_user_preferences_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_user_preferences_user ON public.user_preferences USING btree (user_id);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- Name: review review_after_delete; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER review_after_delete AFTER DELETE ON public.review FOR EACH ROW EXECUTE FUNCTION public.trigger_update_food_rating_delete();


--
-- Name: reviews review_after_delete; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER review_after_delete AFTER DELETE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.trigger_update_food_rating_delete();


--
-- Name: review review_after_insert; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER review_after_insert AFTER INSERT ON public.review FOR EACH ROW EXECUTE FUNCTION public.trigger_update_food_rating();


--
-- Name: reviews review_after_insert; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER review_after_insert AFTER INSERT ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.trigger_update_food_rating();


--
-- Name: review review_after_update; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER review_after_update AFTER UPDATE ON public.review FOR EACH ROW EXECUTE FUNCTION public.trigger_update_food_rating();


--
-- Name: reviews review_after_update; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER review_after_update AFTER UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.trigger_update_food_rating();


--
-- Name: favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: food_flavors food_flavors_flavor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.food_flavors
    ADD CONSTRAINT food_flavors_flavor_id_fkey FOREIGN KEY (flavor_id) REFERENCES public.flavors(flavor_id) ON DELETE CASCADE;


--
-- Name: food_flavors food_flavors_food_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.food_flavors
    ADD CONSTRAINT food_flavors_food_id_fkey FOREIGN KEY (food_id) REFERENCES public.foods(food_id) ON DELETE CASCADE;


--
-- Name: food_image food_image_food_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.food_image
    ADD CONSTRAINT food_image_food_id_fkey FOREIGN KEY (food_id) REFERENCES public.food(id) ON DELETE CASCADE;


--
-- Name: food_images food_images_food_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.food_images
    ADD CONSTRAINT food_images_food_id_fkey FOREIGN KEY (food_id) REFERENCES public.foods(food_id) ON DELETE CASCADE;


--
-- Name: food_ingredients food_ingredients_food_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.food_ingredients
    ADD CONSTRAINT food_ingredients_food_id_fkey FOREIGN KEY (food_id) REFERENCES public.foods(food_id) ON DELETE CASCADE;


--
-- Name: food_ingredients food_ingredients_ingredient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.food_ingredients
    ADD CONSTRAINT food_ingredients_ingredient_id_fkey FOREIGN KEY (ingredient_id) REFERENCES public.ingredients(ingredient_id) ON DELETE CASCADE;


--
-- Name: foods foods_region_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.foods
    ADD CONSTRAINT foods_region_id_fkey FOREIGN KEY (region_id) REFERENCES public.regions(region_id);


--
-- Name: restaurant_facilities restaurant_facilities_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.restaurant_facilities
    ADD CONSTRAINT restaurant_facilities_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(restaurant_id) ON DELETE CASCADE;


--
-- Name: restaurant_foods restaurant_foods_food_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.restaurant_foods
    ADD CONSTRAINT restaurant_foods_food_id_fkey FOREIGN KEY (food_id) REFERENCES public.foods(food_id) ON DELETE CASCADE;


--
-- Name: restaurant_foods restaurant_foods_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.restaurant_foods
    ADD CONSTRAINT restaurant_foods_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(restaurant_id) ON DELETE CASCADE;


--
-- Name: review review_food_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_food_id_fkey FOREIGN KEY (food_id) REFERENCES public.food(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: user_preferences user_preferences_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

