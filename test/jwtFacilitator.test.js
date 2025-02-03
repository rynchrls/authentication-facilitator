const {
  authenticateToken,
  buildToken,
  resolveToken,
  enforceJWT,
} = require("../index");

const dotenv = require("dotenv");
dotenv.config({ path: ".env.dev" });

const SECRET = "DEV_MODE";

// Test 1: Test if token generation works
describe("JWT Facilitator", () => {
  it("should generate an access token", () => {
    const payload = { userId: 1 };
    const token = buildToken(payload, SECRET, "1h");
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
  });

  // Test 2: Test if token verification works
  it("should verify a valid access token", async () => {
    const payload = { userId: 1 };
    const token = buildToken(payload, SECRET);

    const decoded = await authenticateToken(token, SECRET);
    expect(decoded).toBeDefined();
    expect(decoded?.userId).toBe(1);
  });

  it("should return null for an invalid access token", async () => {
    const invalidToken = "invalidToken123";
    const decoded = await authenticateToken(invalidToken, SECRET);
    expect(decoded).toBeNull();
  });

  it("should decode the token proplerly when the token is invalid", async () => {
    const token = "invalidjujutoken123";
    const decoded = await resolveToken(token);
    expect(decoded).toBeNull();
  });

  it("should return true or something simililar after the token was validated", async () => {
    const token = process.env.SAMPLE_TOKEN;
    const decoded = await resolveToken(token);
    expect(decoded).toBeDefined();
  });

  const mockSecret = SECRET;
  const mockUser = { id: 1, username: "testUser" };
  const mockToken = buildToken(mockUser, mockSecret);

  let req, res, next;

  beforeEach(() => {
    req = { headers: { authorization: `Bearer ${mockToken}` } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  // ✅ Test 1: Should call `next()` if token is valid
  it("should allow access with a valid token", async () => {
    await enforceJWT(mockSecret)(req, res, next);
    expect(req.user).toBeDefined();
    expect(req.user.id).toBe(mockUser.id);
    expect(next).toHaveBeenCalled(); // Ensures next() is called
  });

  // ❌ Test 2: Should return 401 if no token is provided
  it("should return 401 if no token is provided", async () => {
    req.headers.authorization = undefined;
    await enforceJWT(mockSecret)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Access Denied: No Token Provided",
    });
  });
});
