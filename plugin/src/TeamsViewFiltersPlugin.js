import React from "react";
import { VERSION, FiltersListItemType } from "@twilio/flex-ui";
import { FlexPlugin } from "flex-plugin";
import CustomTaskListContainer from "./components/CustomTaskList/CustomTaskList.Container";
import reducers, { namespace } from "./states";
import { fetchWorkersData } from "./api";
const PLUGIN_NAME = "TeamsViewFiltersPlugin";

export default class TeamsViewFiltersPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  async init(flex, manager) {
    this.registerReducers(manager);

    const options = { sortOrder: -1 };
    setCustomFilters();

    flex.AgentDesktopView.Panel1.Content.add(
      <CustomTaskListContainer key="TeamsViewFiltersPlugin-component" />,
      options
    );

    function setCustomFilters() {
      fetchWorkersData(manager.workerClient.workspaceSid)
        .then((data) => {
          const { skills, roles } = data;
          const skillsFilter = () => {
            return {
              id: "data.attributes.routing.skills",
              title: "Skills",
              fieldName: "skills",
              type: FiltersListItemType.multiValue,
              options: skills.map((skill) => ({
                value: skill,
                label: skill,
                default: false,
              })),
              condition: "IN",
            };
          };

          const rolesFilter = () => {
            return {
              id: "data.attributes.roles",
              title: "Roles",
              fieldName: "roles",
              type: FiltersListItemType.multiValue,
              options: roles.map((role) => ({
                value: role,
                label: role,
                default: false,
              })),
              condition: "IN",
            };
          };
          flex.TeamsView.defaultProps.filters = [
            flex.TeamsView.activitiesFilter,
            rolesFilter,
            skillsFilter,
          ];
        })
        .catch((err) => {
          console.log("Error while fetching workers' skills and roles", err);
        });
    }
  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint-disable-next-line
      console.error(
        `You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`
      );
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
