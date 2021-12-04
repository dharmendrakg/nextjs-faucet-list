import { useState, useEffect } from "react";
import {
  DataGrid,
  GridOverlay,
  useGridApiContext,
  useGridState,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux";
import LinearProgress from '@mui/material/LinearProgress';
import { IconButton, useMediaQuery, Pagination, Box, Stack, Chip, Avatar } from "@mui/material";
import Rating from "@mui/material/Rating";
import Link from "@/src/Link";
import { darken, lighten } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import {
  getFaucetList,
  updateFavoriteSites,
  updateVisited,
  clearFavorite,
} from "@/redux/slices/faucetListSlice";
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import ClearConfirmation from "./ClearConfirmation";

const useStyles = makeStyles((theme) => {
  const getBackgroundColor = (color) =>
    theme.palette.mode === "dark" ? darken(color, 0.6) : lighten(color, 0.6);

  const getHoverBackgroundColor = (color) =>
    theme.palette.mode === "dark" ? darken(color, 0.5) : lighten(color, 0.5);
  return {
    root: {
      "& .super-app-theme--header": {
        backgroundColor: "rgb(193 191 191 / 55%)",
        "&:hover": {
          backgroundColor: "rgb(181 180 180 / 55%)",
        }
      },
      "& .super-app-theme--favorite": {
        backgroundColor: getBackgroundColor(theme.palette.info.main),
        "&:hover": {
          backgroundColor: getHoverBackgroundColor(theme.palette.info.main),
        },
      },
    },
  };
});

function renderRating({ row }) {
  let value = 5;
  switch (row.status) {
    case "Good":
      value = 5;
      break;
    case "Empty":
      value = 1;
      break;
    case "Critical":
      value = 2;
      break;
    default:
      value = 5;
  }
  return <Rating readOnly value={value} />;
}

function CustomPagination() {
  const apiRef = useGridApiContext();
  const [state] = useGridState(apiRef);

  return (
    <Pagination
      color="primary"
      count={state.pagination.pageCount}
      page={state.pagination.page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}

function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <div style={{ position: 'absolute', top: 0, width: '100%' }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
}

function CustomToolbar() {
  const dispatch = useDispatch();
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      {/* <GridToolbarExport /> */}
      <ClearConfirmation onConfirm={() => dispatch(clearFavorite())} />
    </GridToolbarContainer>
  );
}

export default function Table() {
  const [rows, setRows] = useState([]);
  const isDownSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const {
    isFetching,
    isSuccess,
    isError,
    errorMessage,
    sites,
    selectedCoinSites,
    favoriteSites,
    visited,
  } = useSelector((state) => state.faucetList);
  const dispatch = useDispatch();
  const classes = useStyles();

  const buttonClickHandler = (e, row) => {
    dispatch(updateVisited(row));
  };

  const renderFavorite = ({ row }) => {
    const getFav = () => {
      if (favoriteSites.includes(row.id)) {
        return 1;
      } else {
        return 0;
      }
    };
    return (
      <Rating
        max={1}
        key={row.id}
        value={getFav()}
        onChange={(event, newValue) => {
          dispatch(updateFavoriteSites({ element: row.id, value: newValue }));
        }}
      />
    );
  };

  const renderVisit = ({ row }) => {
    return (
      <IconButton
        color={row.visited ? "error" : "success"}
        aria-label="Visit"
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => buttonClickHandler(e, row)}
        href={row.link + "?r=EC-UserId-6449"}
      >
        <AirplanemodeActiveIcon />
      </IconButton>
    );
  };

  const renderTimer = ({ row }) => {
    return (
      <Chip label={row.timer} size="small" />
    );
  };

  const renderFaucetName = ({ row }) => {
    return (
      <Link
        href={row.link + "?r=EC-UserId-6449"}
        id={row.siteId}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
        onClick={(e) => buttonClickHandler(e, row)}
      >
        {row.siteName}
      </Link>
    );
  };

  const columns = [
    {
      field: "favorite",
      headerName: "*",
      renderCell: renderFavorite,
      flex: 0.01,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "siteName",
      type: "string",
      headerName: "Faucet Name",
      renderCell: renderFaucetName,
      flex: 3,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "status",
      headerName: "Rating",
      renderCell: renderRating,
      flex: 1,
      hide: isDownSmall ? true : false,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "owner",
      type: "string",
      headerName: "Owner",
      hide: true,
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "users",
      type: "number",
      headerName: "Users",
      hide: isDownSmall ? true : false,
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "activeSince",
      type: "string",
      headerName: "Active Since",
      hide: isDownSmall ? true : false,
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "timer",
      type: "number",
      headerName: "Timer",
      renderCell: renderTimer,
      hide: false,
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "reward",
      type: "number",
      headerName: "Reward",
      hide: true,
      flex: 1,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "visit",
      headerName: "Visit",
      type: "actions",
      renderCell: renderVisit,
      flex: 0.2,
      headerClassName: "super-app-theme--header",
    },
  ];

  useEffect(() => {
    if (sites.length === 0) {
      dispatch(getFaucetList());
    }
  }, [dispatch, sites.length]);

  useEffect(() => {
    const temp = selectedCoinSites.map(
      ({
        siteId,
        siteName,
        owner,
        activeSince,
        reward,
        abilityToPay,
        timeFrame,
        users,
        totalPaid,
        currency,
        link,
      }) => {
        return {
          id: siteId,
          favorite: favoriteSites.includes(siteId) ? 1 : 0,
          siteName: siteName,
          status: abilityToPay,
          timer: timeFrame,
          reward: reward,
          link: link,
          owner,
          currency,
          users,
          totalPaid,
          activeSince,
          visited: visited.filter((visit) => visit.id === siteId).length === 1,
        };
      }
    );
    setRows(temp);
  }, [favoriteSites, selectedCoinSites, visited]);

  return (
    <Box sx={{ width: "100%" }} className={classes.root}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={20}
        autoHeight={true}
        autoPageSize={true}
        // getRowClassName={(params) =>
        //   params.getValue(params.id, 'favorite') ? "super-app-theme--favorite" : "super-app-theme--non-favorite"
        // }
        loading = {isFetching}
        components={{
          LoadingOverlay: CustomLoadingOverlay,
          Pagination: CustomPagination,
          Toolbar: CustomToolbar,
        }}
      />
    </Box>
  );
}
