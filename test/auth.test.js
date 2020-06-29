const request = require("supertest");
const User = require("../model/authModel");
let server=require("../app");
const dbHandler = require("./db-test")
describe('authentication', () => {
    let newUser = {
		username:"test2",
		password:"test2",
		name:"jhon",
		email:"test2"
	}
    beforeAll(async () => {
      await dbHandler.createDb()
    })

    afterEach(async () => {
      await dbHandler.clearDb()
    });
    afterAll(async () => {
      await dbHandler.closeDb()
    });
    let user = {
      "username":"test",
      "password":"test",
      "name":"jhon",
      "email":"test"
    }

  it('should return 200 if user doesnt exist yet', async () => {
    const res = await request(server)
    .post("/auth/register")
    .send({userData: user})  
    expect(res.status).toBe(200)    
    expect(Object.keys(res.body).length).not.toBe(0)
  
  })

  it('return 200 if user exist yet', async () => {
  
    const res = await request(server)
    .post("/auth/login")
    .send({userData: user})  
    expect(res.status).toBe(200)
    

  })

  it('should return 404 if user put invalid password', async () => {
   
    user.password="infidel"
    const res = await request(server)
    .post("/auth/login")
    .send({userData: user})  
    expect(res.status).toBe(404)
    

  })

})
