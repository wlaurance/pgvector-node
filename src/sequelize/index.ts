import * as util from 'util';
import { fromSql, toSql } from '../utils';

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

function registerType(Sequelize: Sequelize): void {
  const DataTypes = Sequelize.DataTypes;
  const PgTypes = DataTypes.postgres;
  const ABSTRACT = DataTypes.ABSTRACT.prototype.constructor;

  class VECTOR extends ABSTRACT {
    _dimensions: number | undefined;

    constructor(dimensions?: number) {
      super();
      this._dimensions = dimensions;
    }

    toSql(): string {
      if (this._dimensions === undefined) {
        return 'VECTOR';
      }
      if (!Number.isInteger(this._dimensions)) {
        throw new Error('expected integer');
      }
      return util.format('VECTOR(%d)', this._dimensions);
    }

    _stringify(value: number[]): string {
      return toSql(value);
    }

    static parse(value: string): number[] {
      return fromSql(value);
    }
  }

  VECTOR.prototype.key = VECTOR.key = 'vector';

  DataTypes.VECTOR = Sequelize.Utils.classToInvokable(VECTOR);
  DataTypes.VECTOR.types.postgres = ['vector'];

  PgTypes.VECTOR = function VECTOR() {
    if (!(this instanceof PgTypes.VECTOR)) {
      return new PgTypes.VECTOR();
    }
    DataTypes.VECTOR.apply(this, arguments);
  };
  util.inherits(PgTypes.VECTOR, DataTypes.VECTOR);
  PgTypes.VECTOR.parse = DataTypes.VECTOR.parse;
  PgTypes.VECTOR.types = { postgres: ['vector'] };
  DataTypes.postgres.VECTOR.key = 'vector';
}

export { registerType };
