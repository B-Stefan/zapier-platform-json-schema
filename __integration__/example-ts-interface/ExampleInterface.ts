export default interface ExampleInterface {
  stringProp: string;
  dateProp: Date;
  nestedProp: {
    nestedString: string;
    nestedNumber: number;
  };
  multipleBoolProp: string | boolean;
}
