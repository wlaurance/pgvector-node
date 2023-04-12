interface DataTypes {
    postgres: any;
    ABSTRACT: any;
    VECTOR: any;
}
interface Sequelize {
    DataTypes: DataTypes;
    Utils: {
        classToInvokable: (cls: any) => any;
    };
}
declare function registerType(Sequelize: Sequelize): void;
export { registerType };
