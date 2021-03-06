// import chai from "chai";
// expect = chai.expect;
describe("Routes: Token", () => {
  const db = app.db;
  const Users = app.db.models.Users;
  describe("POST /token", () => {
    beforeEach(done => {
      db.sequelize.sync({force: true})
        .then(() => {
          Users
            .create({
              name: "John",
              email: "john@mail.net",
              password: "12345"
            })
            .then(() => done());
        });
    });
    describe("status 200", () => {
      it("returns authenticated user token", done => {
        request.post("/token")
          .send({
            email: "john@mail.net",
            password: "12345"
          })
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.include.keys("token");
            done(err);
          });
      });
    });
    describe("status 401", () => {
      it("throws error when password is incorrect", done => {
        request.post("/token")
          .send({
            email: "john@mail.net",
            password: "WRONG_PASSWORD"
          })
          .expect(401)
          .end((err, res) => {
            done(err);
          });
      });
      it("throws error when email not exist", done => {
        request.post("/token")
          .send({
            email: "wrong@email.com",
            password: "12345"
          })
          .expect(401)
          .end((err, res) => {
            done(err);
          });
      });
      it("throws error when email and password are blank", done => {
        request.post("/token")
          .expect(401)
          .end((err, res) => {
            done(err);
          });
      });
      it("thows error when null password is sent", done => {
        request.post("/token")
          .send({
            email: "john@email.net",
            password: ""
          })
          .expect(401)
          .end((err, res) => {
            done(err);
          });
      });
    });
  });
});
