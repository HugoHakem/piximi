import { styled } from "@mui/material";

import { CollapsibleList } from "components/lists";
import { ClassifierArchitectureSettingsGrid } from "components/styled-components";

type ArchitectureSettingsProps = {
  onModelSelect: (modelIdx: number) => void;
};

export const ClassifierArchitectureSettingsListItem = ({
  onModelSelect,
}: ArchitectureSettingsProps) => {
  const StyledForm = styled("form")({
    // width: '100%',
    display: "flex",
    flexWrap: "wrap",
  });

  return (
    <CollapsibleList
      dense={false}
      primary="Architecture Settings"
      disablePadding={false}
      paddingLeft={true}
      closed={false}
    >
      <StyledForm noValidate autoComplete="off">
        <ClassifierArchitectureSettingsGrid onModelSelect={onModelSelect} />
      </StyledForm>
    </CollapsibleList>
  );
};