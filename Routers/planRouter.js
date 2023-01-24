const express = require('express');
const planRouter = express.Router();
const {protectRoute, isAuthorised} = require("../helper");
const { getAllPlans, getPlan, createPlan, updatePlan, deletePlan, top3Plans } = require('../controller/planController');

planRouter
  .route('/all')
  .get(getAllPlans);

planRouter
  .route('/top3')
  .get(top3Plans)
  
planRouter.use(protectRoute);//check if he has logged in
planRouter
  .route('/single/:id')
  .get(getPlan);

planRouter.use(isAuthorised(['admin','restaurantowner']));

planRouter
  .route('/crud')
  .post(createPlan)

planRouter
  .route('/crud/:id')
  .patch(updatePlan)
  .delete(deletePlan)



module.exports = planRouter;