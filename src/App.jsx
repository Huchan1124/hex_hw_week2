
import { useState } from "react"
import axios from "axios"

const { VITE_BASE_URL, VITE_API_PATH } = import.meta.env

function App() {

  const [isAuth, setIsAuth] = useState(false)

  const [account, setAccount] = useState({
    username: '',
    password: ''
  })

  const [tempProduct, setTempProduct] = useState({});

  const [products, setProducts] = useState([])

  function handleInputChange(e) {
    const { name, value } = e.target

    setAccount(
      {
        ...account,
        [name]: value
      }
    )

  }

  async function handleSignIn(e) {
    e.preventDefault()
    try {
      const { data } = await axios.post(`${VITE_BASE_URL}/v2/admin/signin`, account)

      const { success, token, expired } = data

      if (!success) return

      setAuthToken(token, expired)

      await getProducts()

      setIsAuth(true)

    } catch (error) {
      alert(error.message)

    }
  }


  function setAuthToken(token, expired) {
    document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
    axios.defaults.headers.common['Authorization'] = token;
  };

  async function getProducts() {
    try {
      const { data } = await axios.get(`${VITE_BASE_URL}/v2/api/${VITE_API_PATH}/admin/products`)
      setProducts(data.products)
    } catch (error) {

      alert(error.message)

    }

  }


  async function checkUserSignIn() {
    try {
      const { data } = await axios.post(`${VITE_BASE_URL}/v2/api/user/check`)
      if (!data.success) return
      alert('使用者已登入')
    } catch (error) {
      alert(error.message)
    }
  }



  return (
    <>
      {isAuth ? (<div className="container">
        <button onClick={checkUserSignIn} type="button" className="btn btn-success my-3">檢查使用者是否登入</button>
        <div className="row">
          <div className="col-md-6">
            <h2>產品列表</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>產品名稱</th>
                  <th>原價</th>
                  <th>售價</th>
                  <th>是否啟用</th>
                  <th>查看細節</th>
                </tr>
              </thead>
              <tbody>
                {products && products.length > 0 ? (
                  products.map((item) => (
                    <tr key={item.id}>
                      <td>{item.title}</td>
                      <td>{item.origin_price}</td>
                      <td>{item.price}</td>
                      <td>{item.is_enabled ? "啟用" : "未啟用"}</td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => setTempProduct(item)}
                        >
                          查看細節
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">尚無產品資料</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="col-md-6">
            <h2>單一產品細節</h2>
            {Object.keys(tempProduct).length > 0 ? (
              <div className="card mb-3">
                <img
                  src={tempProduct.imageUrl}
                  className="card-img-top primary-image"
                  alt="主圖"
                />
                <div className="card-body">
                  <h5 className="card-title">
                    {tempProduct.title}
                    <span className="badge bg-primary ms-2">
                      {tempProduct.category}
                    </span>
                  </h5>
                  <p className="card-text">
                    商品描述：{tempProduct.category}
                  </p>
                  <p className="card-text">商品內容：{tempProduct.content}</p>
                  <div className="d-flex">
                    <p className="card-text text-secondary">
                      <del>{tempProduct.origin_price}</del>
                    </p>
                    元 / {tempProduct.price} 元
                  </div>
                  <h5 className="mt-3">更多圖片：</h5>
                  <div className="d-flex flex-wrap">
                    {tempProduct.imagesUrl?.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        className="images img-fluid"
                        alt="副圖"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-secondary">請選擇一個商品查看</p>
            )}
          </div>
        </div>
      </div>) : (<div className="container d-flex flex-column justify-content-center align-items-center vh-100">
        <div className="row justify-content-center">
          <h1 className="h3 mb-3 font-weight-normal text-center">請先登入</h1>
          <div className="col-12">
            <form id="form" className="form-signin"
              onSubmit={handleSignIn}
            >
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="username"
                  placeholder="name@example.com"
                  name="username"
                  value={account.username}
                  onChange={handleInputChange}
                  required
                  autoFocus
                />
                <label htmlFor="username">Email address</label>
              </div>
              <div className="form-floating">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  name="password"
                  value={account.password}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="password">Password</label>
              </div>
              <button
                className="btn btn-lg btn-primary w-100 mt-3"
                type="submit"
              >
                登入
              </button>
            </form>
          </div>
        </div>
      </div>)}
    </>
  )
}

export default App
