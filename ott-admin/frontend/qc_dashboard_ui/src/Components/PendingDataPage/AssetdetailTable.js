import React from "react";
import MatButton from "@material-ui/core/Button";
import { useDispatch, useSelector } from "react-redux";
import { sendNotification } from "Store/Actions";
import { NotificationManager } from "react-notifications";
import copy from "copy-to-clipboard";
import { useEffect } from "react";

const AssetdetailTable = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.pendingInQueueReducer);
  const { logAssetData } = data;

  const createNotification = (data) => {
    let assetId = "";
    data.map((d) => {
      if (d.key === "Asset Id") {
        return (assetId = d.value);
      } else {
        return null;
      }
    });
    dispatch(sendNotification(assetId));
  };
  const clickOnItem = (item, value) => {
    if (
      item === "Asset Id" ||
      item === "URL" ||
      item === "SPOC Email" ||
      item === "Title" ||
      item === "Playability" ||
      item === "License Url"
    ) {
      NotificationManager.success(`${item} copied`, "", 200);
      copy(value);
    }
  };

  const getChaupal = (_id) => {
    const headers = {
      authorization: `bearer ${localStorage.getItem("authToken")}`, //`bearer S48TBplphIX3euvjJl2KnIJ6dvKcvCk6`,
      subscriberId: `${localStorage.getItem("subscriberid")}`,
      contentType: "application/json",
    };
    //  params = {'partner':'hoichoi'}
    fetch(
      `https://tb.tapi.videoready.tv/qoe-mobile-services/api/v1/content/playback/${_id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
      }
    )
      .then((res) => res.json())
      .then((json) => {
        console.log("Chaupal-2-", json);
        if (json?.code == 0) {
          localStorage.setItem(
            "chaupal_Licence_url",
            json.data?.playUrls[1].licenceUrl
          );
        }
      });
  };

  useEffect(() => {
    if (Object.keys(logAssetData).length > 0) {
      if (logAssetData?.data[6].value == "CHAUPAL") {
        getChaupal(logAssetData?.data[0].value.slice(8));
      }
    }
  }, [logAssetData]);
  return (
    <>
      <div className="assetdetailtable">
        <h3>
          <MatButton onClick={() => createNotification(logAssetData?.data)}>
            Send Notification{" "}
          </MatButton>
        </h3>
        <ul>
          {logAssetData?.data &&
            logAssetData?.data.map((d, index) => {
              return (
                <React.Fragment key={index}>
                  {d.value !== null && (
                    <li>
                      {d.key}
                      {logAssetData?.data[6]?.value == "CHAUPAL" &&
                      d.key == "License Url" ? (
                        <b
                          className={
                            d.key === "Title" ||
                            d.key === "Asset Id" ||
                            d.key === "URL" ||
                            d.key === "SPOC Email" ||
                            d.key === "Playability" ||
                            d.key === "License Url"
                              ? "copy"
                              : ""
                          }
                          onClick={() => clickOnItem(d.key, d.value)}
                        >
                          {localStorage.getItem("chaupal_Licence_url")}
                        </b>
                      ) : (
                        <b
                          className={
                            d.key === "Title" ||
                            d.key === "Asset Id" ||
                            d.key === "URL" ||
                            d.key === "SPOC Email" ||
                            d.key === "Playability" ||
                            d.key === "License Url"
                              ? "copy"
                              : ""
                          }
                          onClick={() => clickOnItem(d.key, d.value)}
                        >
                          {d?.value}
                        </b>
                      )}
                    </li>
                  )}
                </React.Fragment>
              );
            })}
        </ul>
      </div>
    </>
  );
};

export default AssetdetailTable;
