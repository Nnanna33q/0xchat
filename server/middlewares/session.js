import session from "express-session";
import MongoStore from "connect-mongo";

export const sessionParser = session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET,
    cookie: {     // Set sameSite to strict
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_CONNECTIONSTRING,
        ttl: 1000 * 60 * 60 * 24
    }
    )
})