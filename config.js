exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || 'mongodb://testuser:password1@ds231242.mlab.com:31242/anybuddy-full-stack-capstone';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://testuser:password1@ds261342.mlab.com:61342/anybuddy-test';
exports.PORT = process.env.PORT || 8080;
