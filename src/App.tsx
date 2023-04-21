import React, { useState } from "react";
import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";

import CustomerData from "../src/data/customerLocations.json";
import PlantData from "../src/data/plantationProjects.json";

const useStyles = makeStyles({
  searchInput: {
    marginTop: "10px !important;",
    marginLeft: "50px !important;",
  },
  maintitle: {
    marginTop: "20px !important;",
    marginLeft: "50px !important;",
    fontWeight: "600 !important;",
  },
  searchText: {
    marginTop: "20px !important;",
    marginLeft: "60px !important;",
    fontWeight: "600 !important;",
  },
  distanceItem: {
    marginLeft: "80px",
    marginBottom: "20px",
    paddingLeft: "15px",
  },
  projectName: {
    marginTop: "10px !important;",
    fontWeight: "600 !important;",
  },
  distanceText: {
    fontWeight: "400 !important;",
  },
});

function App() {
  const classes = useStyles();
  const [curSearch, setCurSearch] = useState("");
  const [curResults, setCurResults] = useState<Array<any>>([]);

  function distance(lat1: any, lat2: any, lon1: any, lon2: any) {
    lon1 = (lon1 * Math.PI) / 180;
    lon2 = (lon2 * Math.PI) / 180;
    lat1 = (lat1 * Math.PI) / 180;
    lat2 = (lat2 * Math.PI) / 180;

    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a =
      Math.pow(Math.sin(dlat / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);
    let c = 2 * Math.asin(Math.sqrt(a));
    let r = 6371;

    return c * r;
  }

  const checkContains = (
    curAllDistances: Array<any>,
    curDistance: number,
    curProjectName: string
  ) => {
    let status = false;

    for (let i = 0; i < curAllDistances?.length; i++) {
      if (
        curAllDistances[i]?.distance === curDistance &&
        curAllDistances[i]?.projectName === curProjectName
      ) {
        status = true;
        break;
      }
    }
    return status;
  };

  const getData = (strSearch: string) => {
    let selCustomerData: any = {};
    let compareFlag = false;
    for (let i = 0; i < CustomerData?.length; i++) {
      let curCustomerData = CustomerData[i];

      if (curCustomerData.name.toLowerCase() === strSearch.toLowerCase()) {
        selCustomerData = curCustomerData;
        compareFlag = true;
        break;
      }
    }

    if (compareFlag) {
      let curAllDistances: Array<any> = [];

      for (let i = 0; i < PlantData?.length; i++) {
        let lat1 = selCustomerData.latitude ? selCustomerData.latitude : 0;
        let lon1 = selCustomerData.longitude ? selCustomerData.longitude : 0;
        let lat2 = PlantData[i]?.latitude ? PlantData[i]?.latitude : 0;
        let lon2 = PlantData[i]?.longitude ? PlantData[i]?.longitude : 0;
        let curDistance = distance(lat1, lat2, lon1, lon2);
        let checkContainFlag = checkContains(
          curAllDistances,
          curDistance,
          PlantData[i]?.projectName
        );

        if (checkContainFlag === false) {
          curAllDistances.push({
            projectName: PlantData[i]?.projectName,
            distance: curDistance,
          });
        }
      }

      curAllDistances.sort((a, b) => {
        if (a.distance < b.distance) {
          return -1;
        } else if (a.distance > b.distance) {
          return 1;
        } else {
          return 0;
        }
      });

      if (curAllDistances.length > 3) {
        let addDatas = [];

        for (let i = 0; i < 3; i++) {
          addDatas.push(curAllDistances[i]);
        }
        setCurResults(addDatas);
      }
    } else {
      setCurResults([]);
    }
  };

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    getData(e.target.value);
    setCurSearch(e.target.value);
  };

  return (
    <Box component="span" sx={{ p: 2 }}>
      <Typography className={classes.maintitle} variant="h4" gutterBottom>
        Planted Coding challenge
      </Typography>
      <TextField
        className={classes.searchInput}
        id="input-with-icon-textfield"
        label="Name"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        variant="standard"
        value={curSearch}
        onChange={onChangeSearch}
      />
      {curResults?.length > 0 && (
        <>
          <Typography className={classes.searchText} variant="h5" gutterBottom>
            {curSearch}
          </Typography>
          {curResults.map((item, index) => (
            <Box
              key={index}
              width={400}
              border={1}
              borderColor="black"
              borderRadius={1}
              className={classes.distanceItem}
            >
              <Typography
                className={classes.projectName}
                variant="h5"
                gutterBottom
              >
                {item?.projectName}
              </Typography>
              <Typography
                className={classes.distanceText}
                variant="h5"
                gutterBottom
              >
                {item?.distance}&nbsp;in&nbsp;km
              </Typography>
            </Box>
          ))}
        </>
      )}
    </Box>
  );
}

export default App;
