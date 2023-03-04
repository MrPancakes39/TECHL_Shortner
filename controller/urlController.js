const Redirect = require("../models/urlModel");
const { z } = require("zod");
const nanoid = require("nanoid");

const RequestSchema = z
    .object({
        code: z
            .string()
            .min(1)
            .default(() => nanoid(12))
            // replaces any non-alphanumeric characters with "_" to be URL safe.
            .transform((val) => val.trim().replace(/[^a-z0-9]/gi, "_")),
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
        errors["type"] = "invalid-format";
        return res.status(400).send({ errors });
    }
    const { code, original_url } = result.data;

    const redirect_in_db = await Redirect.findOne({ short_code: code });
    if (redirect_in_db) {
        const errors = { type: "message", message: `code ${code} is already taken.` };
        return res.status(400).json({ errors });
    }

    await Redirect.create({
        short_code: code,
        destination_url: original_url,
    });

    // vulnerable to error if endpoint changes.
    const short_url = `${req.protocol}://${req.get("host")}/api/redirect/${code}`;
    return res.json({ short_url });
};

module.exports.redirect = async function (req, res) {
    const code = req.params.code.toString();
    const redirect_in_db = await Redirect.findOne({ short_code: code });
    if (!redirect_in_db) {
        const errors = { type: "message", message: `code ${code} is not a valid code.` };
        return res.status(400).json({ errors });
    }
    const { destination_url } = redirect_in_db;
    return res.redirect(destination_url);
};
