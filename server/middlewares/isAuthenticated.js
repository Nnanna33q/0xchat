export default function isAuthenticated(req, res, next) {
    req.address ? next() : res.status(401).redirect('/connect');
}