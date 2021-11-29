import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux";
import { Fab, useMediaQuery } from "@mui/material";
import Rating from "@mui/material/Rating";
import Link from '@/src/Link';
import { darken, lighten } from '@mui/material/styles'
import { makeStyles } from '@mui/styles';
import {
  getFaucetList,
  updateFavoriteSites
} from "@/redux/slices/faucetListSlice";

const useStyles = makeStyles((theme) => {
  const getBackgroundColor = (color) => theme.palette.mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6);

  const getHoverBackgroundColor = (color) => theme.palette.mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5);
  return {
    root: {
      '& .super-app-theme--header': {
        backgroundColor: 'rgba(255, 7, 0, 0.55)',
      },
      '& .super-app-theme--favorite': {
        backgroundColor: getBackgroundColor(theme.palette.info.main),
        '&:hover': {
          backgroundColor: getHoverBackgroundColor(theme.palette.info.main),
        }
      }
    },
  }});

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

export default function Table() {
  const [rows, setRows] = useState([]);
  const isDownSmall = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const { isFetching, isSuccess, isError, errorMessage, sites, selectedCoinSites, favoriteSites } = useSelector(
    (state) => state.faucetList
  );
  const dispatch = useDispatch();
  const classes = useStyles();

  const buttonClickHandler = (e) => {
    e.target.style.backgroundColor = "black";
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
      <Fab
        variant="extended"
        color="secondary"
        href={row.link + "?r=EC-UserId-6449"}
        id={row.siteId}
        target="_blank"
        rel="noopener noreferrer"
        onClick={()=>buttonClickHandler(row)}
      >
        Visit
      </Fab>
    );
  };

  const renderFaucetName = ({ row }) => {
    return (
      <Link
        href={row.link + "?r=EC-UserId-6449"}
        id={row.siteId}
        target="_blank"
        rel="noopener noreferrer"
        style={{color: "blue", textDecoration: "none"}}
      >
        {row.siteName}
      </Link>
    );
  };

  const columns = [
    { field: "siteName", type:"string", headerName: "Faucet Name", renderCell: renderFaucetName, flex: 3, headerClassName: 'super-app-theme--header', },
    {
      field: "status",
      headerName: "Status",
      renderCell: renderRating,
      flex: 1,
      hide: isDownSmall ? true : false,
      headerClassName: 'super-app-theme--header',
    },
    { field: "timer", type: "number", headerName: "Timer", hide: isDownSmall ? true : false, flex: 1, headerClassName: 'super-app-theme--header', },
    { field: "reward", type: "number", headerName: "Reward", hide: isDownSmall ? true : false, flex: 1, headerClassName: 'super-app-theme--header', },
    {
      field: "visit",
      headerName: "Visit",
      type: 'actions',
      renderCell: renderVisit,
      flex: 1, 
      headerClassName: 'super-app-theme--header',
    },
    {
        field: "favorite",
        headerName: "Favorite",
        renderCell: renderFavorite,
        flex: 0.3,
        headerClassName: 'super-app-theme--header',
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
          siteName: siteName,
          status: abilityToPay,
          timer: timeFrame,
          reward: reward,
          link: link,
          favorite: favoriteSites.includes(siteId) ? 1 : 0,
        };
      }
    );
    setRows(temp);
  }, [favoriteSites, selectedCoinSites]);

  return (
    <div style={{ width: '100%' }} className={classes.root}>
        <DataGrid
            rows={rows}
            columns={columns}
            pageSize={20}
            autoHeight={true}
            autoPageSize={true}
            getRowClassName={(params) =>
              params.getValue(params.id, 'favorite') ? "super-app-theme--favorite" : "super-app-theme--non-favorite"
            }
        />
    </div>
  );
}
