/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import {fireEvent, screen } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import {formatFile,formatDate} from "../app/format.js"
import router from "../app/Router.js";
import {ROUTES, ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store.js"

// jest.mock("../app/store", () => mockStore)


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then ...", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      const message = screen.getByText("Envoyer une note de frais")
      expect(message).toBeTruthy()
    })
  })

  describe("When I upload  file in the input field " , () => {
    test("the file has  correctely extension ", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const fileName = 'hello.png'
      const file = new File(['hello'], fileName, { type: 'image/png', lastModified: new Date(Date.now()),size :12 })
      const test  =  formatFile(file)
      expect(fileName).toStrictEqual(test)

    })
    test("the file has not correctely extension ", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const fileName = 'hello.pong'
      const file = new File(['hello'], fileName, { type: 'image/pong', lastModified: new Date(Date.now()),size :12 })
      const error  = () => formatFile(file)
      expect(error).toThrowError(new Error("le format n'est pas conforme"))

    })
    test("the file has  uploaded ",  () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const html = NewBillUI()
      document.body.innerHTML = html

      const testNewBill = new NewBill({
        document , onNavigate, store : mockStore, localStorage:window.localStorage
      })
      // const  handleChangeFile = jest.fn(testNewBill.handleChangeFile)
      const handleChangeFile = jest.fn((e) => testNewBill.handleChangeFile(e))

      const inputFile =  screen.getByTestId("file")

      const fileName = 'hello.png'
      const file = new File(['hello'], fileName, { type: 'image/png', lastModified: new Date(Date.now()),size :12 })
      inputFile.addEventListener('change',handleChangeFile)
      userEvent.upload(inputFile , file)
      console.log(inputFile.files[0].name);
      expect(handleChangeFile).toHaveBeenCalled()
      expect(inputFile.files[0]).toStrictEqual(file)
      expect(inputFile.files).toHaveLength(1)


    })
  })
  describe("When I write on the field in form " , () => {
    test("Then ,  submit form and no data entry with Html5 Validation  ", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const html = NewBillUI()
      document.body.innerHTML = html

      const testNewBill = new NewBill({
        document , onNavigate, store : null, localStorage:window.localStorage
      })
      const  handleSubmit = jest.fn(() => testNewBill.handleSubmit())
      const buttonSubmit =  screen.getByRole('button')
      userEvent.click(buttonSubmit)
      expect(handleSubmit).not.toHaveBeenCalled()

    })
    test("Then ,  submit form and complete data  ", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const html = NewBillUI()
      document.body.innerHTML = html

      const testNewBill = new NewBill({
        document , onNavigate, store : mockStore, localStorage:window.localStorage
      })
      const fileName = 'hello.png'
      const file = new File(['hello'], fileName, { type: 'image/png', lastModified: new Date(Date.now()),size :12 })
      const formData  = {
        type : 'Services en ligne',
        name : 'expenseName',
        date : '1980-04-10',
        amount :  '250',
        vat : '20',
        pct : '10',
        file : file
      }
      const inputNameExpense = screen.getByTestId('expense-name')
      userEvent.type(inputNameExpense, formData.name)
      expect(inputNameExpense).toHaveValue(formData.name)

      const inputTypeExpense = screen.getByTestId('expense-type')
      userEvent.selectOptions(inputTypeExpense,[formData.type])
      expect(inputTypeExpense).toHaveValue(formData.type)

      const inputDate = screen.getByTestId('datepicker')
      fireEvent.change(inputDate, { target: { value: formData.date} });
      expect(inputDate.value).toBe(formData.date)

      const inputAmount = screen.getByTestId('amount')
      userEvent.type(inputAmount, formData.amount)
      expect(inputAmount.value).toBe(formData.amount)

      const inputVat = screen.getByTestId('vat')
      userEvent.type(inputVat, formData.vat)
      expect(inputVat.value).toBe(formData.vat)

      const inputPct = screen.getByTestId('pct')
      userEvent.type(inputPct, formData.pct)
      expect(inputPct.value).toBe(formData.pct)

      const inputFile = screen.getByTestId('file')
      userEvent.upload(inputFile , formData.file)

      const  handleSubmit = jest.fn(() => testNewBill.handleSubmit)
      // cible form new Bill not button
      const form =  screen.getByTestId("form-new-bill")
      form.addEventListener('submit',handleSubmit)
      fireEvent.submit(buttonSubmit)
      expect(handleSubmit).toHaveBeenCalled()

    })
  })
})
