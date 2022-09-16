/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import {fireEvent, screen } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import NewBillUI from "../views/NewBillUI.js"
import {NewBill} from "../containers/NewBill.js"
import {formatFile} from "../app/format.js"
import router from "../app/Router.js";
import {ROUTES, ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import { bills } from "../fixtures/bills"
import mockStore from "../__mocks__/store.js"

jest.mock("../app/store", () => mockStore)


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
      const test  =  formatFile(fileName)
      expect(fileName).toStrictEqual(test)

    })
    test("the file has not correctely extension ", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const fileName = 'hello.pong'
      const error  = () => formatFile(fileName)
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
        document , onNavigate, store : null, localStorage:window.localStorage
      })
      const  handleChangeFile = jest.fn(testNewBill.handleChangeFile)
      // const handleChangeFile = jest.fn((e) => testNewBill.handleChangeFile(e))
      expect(handleChangeFile).toHaveBeenCalled()
      const inputFile =  screen.getByTestId("file")
      // const spy = spyOn(testNewBill,"handleChangeFile")
      const fileName = 'hello.png'
      const file = new File([], fileName )
      userEvent.upload(inputFile , file)
      inputFile.addEventListener('change',handleChangeFile)

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
        document , onNavigate, store : null, localStorage:window.localStorage
      })
      const  handleSubmit = jest.fn(() => testNewBill.handleSubmit())
      const buttonSubmit =  screen.getByRole('button')
      const inputNameExpense = screen.getByTestId('expense-name')
      userEvent.type(inputNameExpense, 'expenseName')
      expect(inputNameExpense).toHaveValue('expenseName')

      const inputTypeExpense = screen.getByTestId('expense-type')
      userEvent.selectOptions(inputTypeExpense,['Services en ligne'])
      expect(inputTypeExpense).toHaveValue('Services en ligne')

      const inputDate = screen.getByTestId('datepicker')
      userEvent.type(inputDate,'10/04/1980')
      expect(inputDate).toEqual('10/04/1980')

      const inputAmount = screen.getByTestId('amount')

      const inputVat = screen.getByTestId('vat')

      const inputPct = screen.getByTestId('pct')

      const inputFile = screen.getByTestId('file')

    })
  })
})
