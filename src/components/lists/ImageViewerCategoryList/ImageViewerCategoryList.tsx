import React, { useState } from "react";
import { Box, IconButton, List } from "@mui/material";
import { Visibility, VisibilityOff, Add } from "@mui/icons-material";
import { ImageViewerCategoryItem } from "components/list-items/CategoryItem/ImageViewerCategoryItem";
import { CollapsibleListItem } from "components/list-items/CollapsibleListItem";
import { useDispatch, useSelector } from "react-redux";
import { imageViewerSlice } from "store/imageViewer";
import { selectImageViewerActiveKindsWithFullCat } from "store/data/selectors/reselectors";
import { selectFilteredImageViewerCategoryIds } from "store/imageViewer/selectors/selectFilteredAnnotationCategoryIds";
import { CreateCategoryDialogNew } from "components/dialogs/CreateCategoryDialogNew/CreateCategoryDialogNew";
import { useDialogHotkey } from "hooks";
import { HotkeyView } from "utils/common/enums";
import { KindWithCategories } from "store/data/types";

export const ImageViewerCategoryList = () => {
  const dispatch = useDispatch();
  const kinds = useSelector(selectImageViewerActiveKindsWithFullCat);
  const filteredCategoryIds = useSelector(selectFilteredImageViewerCategoryIds);
  // NOTE: keep for quick checking if kind is hidden
  const [filteredKinds, setFilteredKinds] = useState<Array<string>>([]);
  const [selectedKind, setSelectedKind] = useState<string>();

  const {
    onClose: handleCloseCreateCategoryDialog,
    onOpen: handleOpenCreateCategoryDialog,
    open: isCreateCategoryDialogOpen,
  } = useDialogHotkey(HotkeyView.DialogWithAction);

  const isKindFiltered = (kind: KindWithCategories) => {
    //HACK: refactor -- O(n*m)
    return kind.categories.every((cat) => {
      return filteredCategoryIds.includes(cat.id);
    });
  };

  const handleToggleKindVisibility = (
    event: React.MouseEvent,
    kind: KindWithCategories
  ) => {
    event.stopPropagation();
    if (filteredKinds.includes(kind.id)) {
      setFilteredKinds(
        filteredKinds.filter((hiddenKind) => hiddenKind !== kind.id)
      );

      dispatch(
        imageViewerSlice.actions.removeFilters({
          categoryIds: kind.categories.map((category) => category.id),
        })
      );
    } else {
      setFilteredKinds([...filteredKinds, kind.id]);
      dispatch(
        imageViewerSlice.actions.addFilters({
          categoryIds: kind.categories.map((category) => category.id),
        })
      );
    }
  };

  const handleOpenCreateCategoryOfKind = (
    event: React.MouseEvent,
    kind: string
  ) => {
    event.stopPropagation();
    setSelectedKind(kind);
    handleOpenCreateCategoryDialog();
  };

  return (
    <>
      <List dense sx={(theme) => ({ py: 0 })}>
        {kinds.map((kind) => {
          return (
            <CollapsibleListItem
              primaryText={kind.id}
              key={kind.id}
              carotPosition="start"
              secondary={
                <Box
                  display="flex"
                  gap={1}
                  sx={(theme) => ({
                    "& .MuiIconButton-root": {
                      px: 0,
                      py: 0,
                      "&:hover": { color: theme.palette.primary.main },
                    },
                  })}
                >
                  <IconButton
                    disableRipple
                    onClick={(event) => {
                      handleOpenCreateCategoryOfKind(event, kind.id);
                    }}
                  >
                    <Add fontSize="small" />
                  </IconButton>
                  <IconButton
                    disableRipple
                    onClick={(event) => handleToggleKindVisibility(event, kind)}
                  >
                    {isKindFiltered(kind) ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </IconButton>
                </Box>
              }
            >
              {kind.categories.map((category) => {
                return (
                  <ImageViewerCategoryItem
                    category={category}
                    kind={kind.id}
                    key={category.id}
                  />
                );
              })}
            </CollapsibleListItem>
          );
        })}
      </List>
      {selectedKind && (
        <CreateCategoryDialogNew
          kind={selectedKind}
          onClose={handleCloseCreateCategoryDialog}
          open={isCreateCategoryDialogOpen}
          changesPermanent={false}
        />
      )}
    </>
  );
};
