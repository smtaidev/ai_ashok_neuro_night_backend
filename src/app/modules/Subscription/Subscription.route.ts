import { Router } from "express";

import auth from "../../middlewares/auth";
import { SubscriptionController } from "./Subscription.contllors";

const router = Router();

router.post(
  "/create-subscription/:id",
  auth('companyAdmin','companyEmployee'),
  SubscriptionController.createSubscription
);

router.get(
  "/my-subscription",
  auth(),
  SubscriptionController.getMySubscription
);

router.get("/", auth(), SubscriptionController.getAllSubscription);

router.get(
  "/:subscriptionId",
  auth(),
  SubscriptionController.getSingleSubscription
);

router.put(
  "/:subscriptionId",
  auth("superAdmin", 'companyAdmin'),
  SubscriptionController.updateSubscription
);

router.delete(
  "/:subscriptionId",
  auth('companyAdmin', "superAdmin"),
  SubscriptionController.deleteSubscription
);

router.post("/stripe/webhook", SubscriptionController.handleStripeWebhook);

export const SubscriptionRoutes = router;