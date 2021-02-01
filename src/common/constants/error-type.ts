export const ErrorType = {
    BadRequest: {
        status: 400,
        message: 'The request has an incorrect format!',
    },
    NotFound: {
        status: 404,
        message: 'Route not found!',
    },
    Unauthorized: {
        status: 401,
        message: 'Authentication credentials not valid!',
    },
    Forbidden: {
        status: 403,
        message: "You're missing permission to execute this request.",
    },
};
