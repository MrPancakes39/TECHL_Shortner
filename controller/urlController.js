const Redirect = require("../models/urlModel");
const { z } = require("zod");
const nanoid = require("nanoid");

const RequestSchema = z
    .object({
        code: z
            .string()
            .min(1)
            .default(() => nanoid(12)),
        original_url: z
            .string()
            .url()
            .refine((val) => val.startsWith("http"), {
                message: "We only shortner http URLs",
            }),
    })
    .strict({ message: "Request body is not in correct format" });

module.exports.createRedirect = async function (req, res) {
    const result = RequestSchema.safeParse(req.body);
    if (!result.success) {
        const errors = {};
        result.error.errors.forEach((e) => {
            const field = e.path[0];
            const message = e.message;
            errors[field] = errors[field] ?? [];
            errors[field] = [...errors[field], message];
        });
        return res.status(400).send({ errors });
    }
    console.log(result.data);
    const { code, original_url } = result.data;

    // const safe_code = code
    //     .toString()
    //     .trim()
    //     .replace(/[^a-z0-9]/gi, "_");

    // const redirect_in_db = await Redirect.findOne({ short_code: safe_code });
    // if (redirect_in_db) {
    //     return res.status(400).json({ message: `Code ${safe_code} is already taken.` });
    // }

    // await Redirect.create(
    //     {
    //         short_code: safe_code,
    //         destination_url: original_url,
    //     },
    //     (err) => (err ? res.status(500).json({ message: err.message }) : null)
    // );

    return res.sendStatus(200);
};

module.exports.redirect = async function (req, res) {
    const code = req.params.code.toString();
    const redirect_in_db = await Redirect.findOne({ short_code: code });
    if (!redirect_in_db) {
        return res.status(400).json({ message: `Code ${code} is not a valid code.` });
    }
    const { destination_url } = redirect_in_db;
    return res.redirect(destination_url);
};
