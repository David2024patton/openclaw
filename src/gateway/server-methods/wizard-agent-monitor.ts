import { errorShape } from "../protocol/index.js";
import { ErrorCodes } from "../protocol/index.js";
import { Type } from "@sinclair/typebox";
import { getAgentActivities, getAgentActivity } from "../../wizard/agent-activity-monitor.js";
import type { GatewayRequestHandlers } from "./types.js";

export const wizardAgentMonitorHandlers: GatewayRequestHandlers = {
  "wizard.agents.list": async ({ params, respond }) => {
    const validated = Type.Object({
      projectId: Type.Optional(Type.String()),
    }).safeParse(params);
    
    if (!validated.success) {
      respond(
        false,
        undefined,
        errorShape(ErrorCodes.INVALID_REQUEST, `invalid params: ${validated.error.message}`),
      );
      return;
    }
    
    const activities = getAgentActivities(validated.data.projectId);
    respond(true, { activities }, undefined);
  },
  
  "wizard.agents.get": async ({ params, respond }) => {
    const validated = Type.Object({
      agentId: Type.String(),
    }).safeParse(params);
    
    if (!validated.success) {
      respond(
        false,
        undefined,
        errorShape(ErrorCodes.INVALID_REQUEST, `invalid params: ${validated.error.message}`),
      );
      return;
    }
    
    const activity = getAgentActivity(validated.data.agentId);
    if (!activity) {
      respond(false, undefined, errorShape(ErrorCodes.NOT_FOUND, "agent not found"));
      return;
    }
    
    respond(true, { activity }, undefined);
  },
};
