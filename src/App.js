import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, Fragment } from "react";
import { uiActions } from "./store/ui-slice";
import Notification from "./components/UI/Notification";

let isInitial = true;

function App() {
  const dispatch = useDispatch();
  const showCart = useSelector((state) => state.ui.cartIsVisible);
  const cartItems = useSelector((state) => state.cart.items);
  const notification = useSelector((state) => state.ui.notification);
  useEffect(() => {
    const sendCartData = async () => {
      dispatch(
        uiActions.showNotificaion({
          status: "pending",
          title: "sending...",
          message: "Sending Cart data"
        })
      );
      const response = await fetch(
        "https://react-post-udemy-default-rtdb.firebaseio.com/cart.json",
        {
          method: "PUT",
          body: JSON.stringify(cartItems)
        }
      );
      if (!response.ok) {
        dispatch(
          uiActions.showNotificaion({
            status: "error",
            title: "error...",
            message: "Send Cart data failed"
          })
        );
      }
      dispatch(
        uiActions.showNotificaion({
          status: "success",
          title: "success...",
          message: "Sent Cart data successfully"
        })
      );
      const responseData = await response.json();
    };

    if (isInitial) {
      isInitial = false;
      return;
    }
    sendCartData().catch((error) => {
      dispatch(
        uiActions.showNotificaion({
          status: "error",
          title: "error...",
          message: "Send Cart data failed"
        })
      );
    });
  }, [cartItems, dispatch]);
  return (
    <Fragment>
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      <Layout>
        {showCart && <Cart />}
        <Products />
      </Layout>
    </Fragment>
  );
}

export default App;
